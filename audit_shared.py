import subprocess
from pathlib import Path
root = Path('.').resolve()
shared_files = sorted(root.glob('components/shared/**/*.ts*'))
results = []
for path in shared_files:
    rel = path.relative_to(root).as_posix()
    search_patterns = [rel, f'@/{rel}']
    refs = set()
    for pattern in search_patterns:
        try:
            proc = subprocess.run(['rg', '-l', '--fixed-strings', pattern, '.'], capture_output=True, text=True, check=True)
            lines = proc.stdout.strip().splitlines()
            for line in lines:
                stripped = line.strip()
                if stripped and stripped != rel:
                    refs.add(stripped)
        except subprocess.CalledProcessError as exc:
            if exc.returncode != 1:
                raise
    app_refs = [r for r in refs if r.startswith('app/[locale]/')]
    route_groups = set()
    for ref in app_refs:
        parts = ref.split('/')
        if len(parts) > 2:
            seg = parts[2]
            if seg.startswith('(') and seg.endswith(')'):
                route_groups.add(seg[1:-1])
            elif seg.startswith('[') and seg.endswith(']'):
                route_groups.add('[username]')
    line_count = sum(1 for _ in path.open('r', encoding='utf-8'))
    results.append({'file': rel, 'lines': line_count, 'routes': sorted(route_groups), 'route_count': len(route_groups), 'refs': sorted(refs), 'route_refs': sorted(app_refs)})
for item in results:
    print(item)
