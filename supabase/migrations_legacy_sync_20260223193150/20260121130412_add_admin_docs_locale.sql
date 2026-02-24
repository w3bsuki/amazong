alter table public.admin_docs
  add column if not exists locale text not null default 'en';

create index if not exists admin_docs_locale_idx on public.admin_docs (locale);
;
