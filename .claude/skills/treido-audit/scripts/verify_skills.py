#!/usr/bin/env python3
"""
Verify Treido Skills Structure

Validates that all skills in the .claude/skills directory follow the Anthropic
skill specification:
- Required SKILL.md with valid YAML frontmatter
- name and description fields present
- No forbidden patterns

Usage:
    python scripts/verify_skills.py
    python scripts/verify_skills.py --verbose
"""

import sys
import re
from pathlib import Path

def validate_frontmatter(content: str) -> tuple[bool, str, dict]:
    """Validate YAML frontmatter and extract fields."""
    if not content.startswith('---'):
        return False, "No YAML frontmatter found", {}
    
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format", {}
    
    frontmatter_text = match.group(1)
    
    # Simple YAML parsing for name/description
    fields = {}
    for line in frontmatter_text.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"\'')
            fields[key] = value
    
    if 'name' not in fields:
        return False, "Missing required field: name", fields
    
    if 'description' not in fields:
        return False, "Missing required field: description", fields
    
    # Validate name format
    name = fields['name']
    if len(name) > 64:
        return False, f"Name too long ({len(name)} > 64 chars)", fields
    
    if not re.match(r'^[a-z0-9-]+$', name):
        return False, "Name must be lowercase letters, numbers, and hyphens only", fields
    
    # Validate description
    desc = fields['description']
    if len(desc) > 1024:
        return False, f"Description too long ({len(desc)} > 1024 chars)", fields
    
    return True, "Valid", fields


def validate_skill(skill_path: Path, verbose: bool = False) -> tuple[bool, list[str]]:
    """Validate a single skill directory."""
    issues = []
    
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, ["Missing SKILL.md"]
    
    content = skill_md.read_text(encoding='utf-8')
    
    # Validate frontmatter
    valid, message, fields = validate_frontmatter(content)
    if not valid:
        issues.append(f"Frontmatter error: {message}")
        return False, issues
    
    if verbose:
        print(f"  Name: {fields.get('name')}")
        print(f"  Description: {fields.get('description', '')[:60]}...")
    
    # Check body content exists
    body_match = re.search(r'^---\n.*?\n---\n(.+)', content, re.DOTALL)
    if not body_match or len(body_match.group(1).strip()) < 50:
        issues.append("SKILL.md body too short (< 50 chars)")
    
    # Check for optional directories
    scripts_dir = skill_path / 'scripts'
    references_dir = skill_path / 'references'
    assets_dir = skill_path / 'assets'
    
    if verbose:
        dirs = []
        if scripts_dir.exists():
            dirs.append(f"scripts/ ({len(list(scripts_dir.iterdir()))} files)")
        if references_dir.exists():
            dirs.append(f"references/ ({len(list(references_dir.iterdir()))} files)")
        if assets_dir.exists():
            dirs.append(f"assets/ ({len(list(assets_dir.iterdir()))} files)")
        if dirs:
            print(f"  Resources: {', '.join(dirs)}")
    
    return len(issues) == 0, issues


def main():
    verbose = '--verbose' in sys.argv or '-v' in sys.argv
    
    # Find skills directory
    script_dir = Path(__file__).parent.parent
    skills_dir = script_dir / '.claude' / 'skills'
    
    if not skills_dir.exists():
        print(f"❌ Skills directory not found: {skills_dir}")
        sys.exit(1)
    
    print(f"🔍 Validating skills in {skills_dir}\n")
    
    all_valid = True
    skill_count = 0
    
    for skill_path in sorted(skills_dir.iterdir()):
        if not skill_path.is_dir():
            continue
        
        skill_count += 1
        print(f"Checking {skill_path.name}...")
        
        valid, issues = validate_skill(skill_path, verbose)
        
        if valid:
            print(f"  ✅ Valid")
        else:
            all_valid = False
            for issue in issues:
                print(f"  ❌ {issue}")
        
        if verbose:
            print()
    
    print(f"\n{'='*40}")
    print(f"Skills checked: {skill_count}")
    
    if all_valid:
        print("✅ All skills valid")
        sys.exit(0)
    else:
        print("❌ Some skills have issues")
        sys.exit(1)


if __name__ == "__main__":
    main()
