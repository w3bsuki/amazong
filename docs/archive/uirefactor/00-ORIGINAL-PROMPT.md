# Original UI/UX Refactor Prompt

**Date:** February 1, 2026  
**Status:** Planning Phase

---

## User's Original Request

I want you to prepare a complete ui and ux finalization for production. 
i want us to lock down mobile first.
patterns must be similar on desktop. 

### Authentication & Onboarding
currently, when users sign up, they choose personal/business profile during sign up, but this must happen during onboarding, not in sign in / sign up form. 
when they log in for the first time, they must get onboarding, choosing personal/business profile -> next screen -> uploading info. for business, they must be able to tailor their profile a lot more, they must be able to have a button to export products via csv or whatever our /dashboard and supabase allows, and our nextjs can show. 

### Business Experience
we need to make the business experience like shopify backend with best frontend we can build. 
its 2026, current website patterns are moving. I no longer feel like old web designs and patterns with many buttons etc are convenient. 
People are getting used to seamless native perfect UI and UX, and most of it happens through ai agents. 
we must utilize our ai agent everywhere we can for our platform. 
We must make it the best ui and ux possible. 

### Onboarding Flow Details
After sign in, users must onboard and select account type -> Personal/business. 

**Personal:**
- upload profile picture
- create store name (use profile name)
- here users must select their user name, and it must tell them that they can only change it once after they choose it
- premium profiles will be able to change names
- after they select name/business/personal profile, personal ones must select avatar, location

**Business:**
- can add business name
- vat numbers
- websites
- physical store location
- facebook/instagram pages/links to their business

### Landing Page Vision
the landing page must be seamless ui and ux. 
we currently have clean quick pills. i just feel like our main page could be slightly better, im thinking something like a mix between social media feed and trading platform, because the current horizontal sections are too boring. 

users when they list, must be able to find products. i feel like having these horizontal ones is oldschool design patterns. i feel like we can utilize drawers more, ai search etc. 

for example, in the landing we have quick pills to search for main categories. this is good, but i feel like the ui and ux can be slightly better. i feel like in the landing page instead of collections, we should show these horizontal sections but they should be like store sections, example: instead of Fashion title and products, there will be user profile (avatar) and images under it, u get the idea? 

then the search will be much better, we need to show our ai search better. 

### Bottom Navbar Ideas
I feel like bottom navbar "Обяви" could be renamed to "search" and it could show the current drawer with categories, but it could also have ai search drawer? or? bottom navbar can be improved? 

I have seen you build native app-like nextjs projects, i think u are using framer motion etc. however, shadcn/tailwindcss v4 for b2b/c2c ecommerce we still need to make it look a bit like ecommerce. 

### Design Direction
we need to create this hype design and style. social media mixed with ecommerce, ebay mixed with facebook for example. 

the social aspect is really important. i feel like the bottom navbar perfect buttons would be:

Home / Buy / Sell / Sellers / Profile , or maybe chat can be there. we currently have good patterns, but we need to finalize the ui and ux, onboarding, mobile ui and ux in landing, pages etc. 

Currently our product page on mobile is beginning to look more like a mobile app page, with the tabs for info/seller 

i feel like we can do better. 

### Navigation Pattern Questions

do u think we should keep the circles or quick pills in the landing? 
- if we do the circles on top for main categories, and they open the drawers, we could remove the quick pills
- however the quick pills were fine with the circles appearing under
- but if we keep circles only, it will look more like instagram (familiar pattern->good)
- instagram has stories there, we will just have main categories
- when user clicks a circle, it can open the drawer instead of flooding and shifting our mobile layout with contextual pills, etc? 

### Open Questions
- Is drawer worse than having inline pills, contextual pills? 
- What is the proper pattern for 2026?

### Success Criteria
- Platform must be better than ebay
- Simple is better
- Mobile-first, then desktop parity
- AI agent integration everywhere possible
- Social media + ecommerce hybrid feel

---

## Key Struggles/Issues Identified

1. **Landing page navigation uncertainty** - circles vs quick pills vs both
2. **Drawer vs inline pills** - which pattern is better for UX
3. **Horizontal sections feel outdated** - need more social/feed-like approach
4. **Onboarding currently in wrong place** - should be post-signup flow
5. **Business profiles need more power** - Shopify-like backend experience
6. **AI integration** - need to surface AI search more prominently
7. **Bottom navbar optimization** - current "Обяви" might not be optimal

---

## References
- Instagram (familiar circle patterns)
- Shopify (business backend features)
- eBay (trading platform aspects)
- Facebook Marketplace (social commerce hybrid)
- Modern native apps (seamless UX patterns)
