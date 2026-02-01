#!/usr/bin/env python3
"""
Quick Audit Script for Treido

Runs common violation checks without full linting.
Useful for quick pre-commit checks.

Usage:
    python scripts/quick_audit.py
    python scripts/quick_audit.py --path app/[locale]/(main)/
"""

import sys
import re
from pathlib import Path
from typing import List, Tuple

# Patterns to check
VIOLATIONS = {
    'arbitrary_values': {
        'pattern': r'className="[^"]*\[[^\]]+\][^"]*"',
        'message': 'Arbitrary Tailwind value',
        'severity': 'high',
    },
    'gradient_classes': {
        'pattern': r'className="[^"]*(?:bg-gradient|from-|to-|via-)[^"]*"',
        'message': 'Gradient class (forbidden)',
        'severity': 'high',
    },
    'palette_colors': {
        'pattern': r'className="[^"]*(?:text|bg|border)-(?:red|blue|green|yellow|purple|pink|orange|gray|slate|zinc|neutral|stone)-\d+[^"]*"',
        'message': 'Palette color (use semantic tokens)',
        'severity': 'high',
    },
    'select_star': {
        'pattern': r"\.select\(['\"]?\*['\"]?\)",
        'message': 'select(*) - use explicit field projection',
        'severity': 'medium',
    },
    'console_sensitive': {
        'pattern': r'console\.log\([^)]*(?:user|token|session|password|email|address)[^)]*\)',
        'message': 'Possible sensitive data in console.log',
        'severity': 'critical',
    },
    'hardcoded_string': {
        'pattern': r'<(?:p|h[1-6]|span|button|label)>[\w\s]+</(?:p|h[1-6]|span|button|label)>',
        'message': 'Hardcoded user-facing string (use next-intl)',
        'severity': 'medium',
    },
}

def check_file(file_path: Path) -> List[Tuple[int, str, str, str]]:
    """Check a single file for violations."""
    issues = []
    
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception:
        return issues
    
    lines = content.split('\n')
    
    for name, config in VIOLATIONS.items():
        for i, line in enumerate(lines, 1):
            if re.search(config['pattern'], line, re.IGNORECASE):
                issues.append((
                    i,
                    config['severity'],
                    config['message'],
                    line.strip()[:80]
                ))
    
    return issues


def main():
    # Determine scope
    target_path = Path('.')
    for i, arg in enumerate(sys.argv):
        if arg == '--path' and i + 1 < len(sys.argv):
            target_path = Path(sys.argv[i + 1])
    
    # Find files to check
    extensions = ['.tsx', '.ts']
    exclude_dirs = {'node_modules', '.next', 'dist', 'build', '.git'}
    
    files_to_check = []
    for ext in extensions:
        for file_path in target_path.rglob(f'*{ext}'):
            if not any(ex in file_path.parts for ex in exclude_dirs):
                files_to_check.append(file_path)
    
    print(f"🔍 Checking {len(files_to_check)} files...\n")
    
    total_issues = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}
    
    for file_path in sorted(files_to_check):
        issues = check_file(file_path)
        
        if issues:
            print(f"\n📄 {file_path}")
            for line_num, severity, message, snippet in issues:
                total_issues[severity] += 1
                icon = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '⚪'}[severity]
                print(f"  {icon} L{line_num}: {message}")
                print(f"      {snippet}")
    
    # Summary
    print(f"\n{'='*50}")
    print("Summary:")
    print(f"  🔴 Critical: {total_issues['critical']}")
    print(f"  🟠 High: {total_issues['high']}")
    print(f"  🟡 Medium: {total_issues['medium']}")
    print(f"  ⚪ Low: {total_issues['low']}")
    
    if total_issues['critical'] > 0:
        print("\n❌ Critical issues found - must fix before merge")
        sys.exit(2)
    elif total_issues['high'] > 0:
        print("\n⚠️  High severity issues found")
        sys.exit(1)
    else:
        print("\n✅ No critical or high severity issues")
        sys.exit(0)


if __name__ == "__main__":
    main()
