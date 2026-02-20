import argparse
import pathlib


def is_client_component(source: str) -> bool:
    return '"use client"' in source or "'use client'" in source


def collect_files(root: pathlib.Path, patterns: list[str]) -> list[pathlib.Path]:
    files: set[pathlib.Path] = set()
    for pattern in patterns:
        files.update(root.rglob(pattern))
    return sorted(files)


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="audit-set-request-locale",
        description="Find App Router files missing next-intl setRequestLocale().",
    )
    parser.add_argument(
        "--root",
        default="app/[locale]",
        help="Root directory to scan (default: app/[locale])",
    )
    parser.add_argument(
        "--include-boundaries",
        action="store_true",
        help="Also scan not-found.tsx/loading.tsx/error.tsx files.",
    )
    parser.add_argument(
        "--include-client",
        action="store_true",
        help='Include files that contain a "use client" directive (default: skip).',
    )
    args = parser.parse_args()

    root = pathlib.Path(args.root)
    patterns = ["layout.tsx", "page.tsx"]
    if args.include_boundaries:
        patterns += ["not-found.tsx", "loading.tsx", "error.tsx"]

    files = collect_files(root, patterns)
    missing: list[pathlib.Path] = []
    skipped_client = 0
    checked = 0

    for path in files:
        source = path.read_text(encoding="utf-8")
        if not args.include_client and is_client_component(source):
            skipped_client += 1
            continue
        checked += 1
        if "setRequestLocale" not in source:
            missing.append(path)

    print(f"root: {root}")
    print(f"patterns: {', '.join(patterns)}")
    print(f"files found: {len(files)}")
    print(f"files checked: {checked}")
    print(f"files skipped (client): {skipped_client}")
    print(f"missing setRequestLocale: {len(missing)}")

    for path in missing:
        print(path.as_posix())


if __name__ == "__main__":
    main()

