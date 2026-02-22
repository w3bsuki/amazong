import json
from pathlib import Path
root = Path('app/[locale]')
page_files = sorted(root.rglob('page.tsx'))
known_groups = {'(main)':'main','(auth)':'auth','(onboarding)':'onboarding','(sell)':'sell','(checkout)':'checkout','(chat)':'chat','(account)':'account','(plans)':'plans','(business)':'business','(admin)':'admin','[username]':'profile'}
group_data = {name:{'routes':[], 'layouts':[], 'loading':False, 'error':False, 'not_found':False} for name in known_groups.values()}
for group_folder, group_name in known_groups.items():
    candidate = root / group_folder
    if candidate.exists():
        for special in ['layout.tsx','loading.tsx','error.tsx','not-found.tsx']:
            exists = (candidate / special).exists()
            if special == 'layout.tsx' and exists:
                group_data[group_name]['layouts'].append(str(candidate / special))
            elif special == 'loading.tsx':
                group_data[group_name]['loading'] = exists
            elif special == 'error.tsx':
                group_data[group_name]['error'] = exists
            elif special == 'not-found.tsx':
                group_data[group_name]['not_found'] = exists
for path in page_files:
    rel = path.relative_to(root)
    parts = rel.parts
    top = parts[0]
    if top in known_groups:
        gname = known_groups[top]
        subpath = parts[1:-1] if len(parts) > 2 else []
        module_path = '/'.join(subpath)
        route = '/' if module_path == '' else '/' + module_path
        group_data[gname]['routes'].append({'route': route, 'path': str(rel), 'segments': list(subpath)})
root_special = {}
for special in ['layout.tsx','loading.tsx','error.tsx','not-found.tsx']:
    root_special[special] = (root / special).exists()
print(json.dumps({'group_data':group_data,'root_special':root_special}, indent=2))
