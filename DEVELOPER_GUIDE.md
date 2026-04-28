# 📚 DEVELOPER GUIDE — Post-Optimization

**For:** Developers working with the optimized mxnan.com codebase  
**Last Updated:** April 28, 2026

---

## 🎯 Key Principles

### 1. Server vs Client Components
- **Default to Server Components** (no `"use client"`)
- Only add `"use client"` when you need:
  - Browser APIs (localStorage, geolocation, etc.)
  - React hooks (useState, useEffect, etc.)
  - Event listeners

### 2. Performance-First Mindset
- ✅ Check **re-render causes** before adding state
- ✅ Use **refs** for DOM mutations (not state)
- ✅ **Memoize** expensive computations (motion values, variants)
- ✅ **Throttle** scroll/resize handlers with RAF
- ✅ **Lazy load** heavy components with `dynamic()`

### 3. Configuration Over Hardcoding
- **New navigation items?** → Update `config/navigation.ts`
- **New routes?** → Update `app/` folder structure
- **Showcase components?** → Add to `showcase/demo/` + update config

---

## 🔧 COMMON TASKS

### Add a Navigation Link

**File:** [config/navigation.ts](config/navigation.ts)

```typescript
export const HEADER_NAV: NavItem[] = [
  // ...existing items...
  {
    label: "Resources",
    href: "/resources",
    icon: BookOpen, // Import from lucide-react
    ariaLabel: "Browse resources",
  },
];
```

✅ Header will automatically update (no code changes needed)

---

### Fix a Performance Issue

**Check these in order:**

1. **Is it a re-render issue?**
   ```tsx
   // ❌ BAD: State update on every scroll
   const [scroll, setScroll] = useState(0);
   useEffect(() => {
     window.addEventListener('scroll', () => setScroll(window.scrollY));
   }, []);
   
   // ✅ GOOD: Ref + DOM update
   const scrollRef = useRef(0);
   useEffect(() => {
     window.addEventListener('scroll', () => {
       scrollRef.current = window.scrollY;
       el.textContent = scrollRef.current;
     });
   }, []);
   ```

2. **Is it an animation issue?**
   - Use `useMemo` for motion values
   - Hoist animation variants outside components
   - Use `willChange: 'transform'` for GPU acceleration

3. **Is it a bundle size issue?**
   - Use `dynamic()` for heavy components
   - Check `next.config.ts` for `optimizePackageImports`
   - Import directly: `import { Button } from "@/components/ui/button"` (not barrel)

---

### Handle Hydration Mismatches

**Pattern for theme-sensitive components:**

```tsx
const MyComponent = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <Skeleton />; // or placeholder
  }
  
  return <ActualComponent />;
};
```

---

### Add a Showcase Component

**1. Create:** `showcase/demo/buttons/my-button.tsx`
```tsx
"use client"; // Components in demo always need this

export function MyButton() {
  return <button>Click me</button>;
}
```

**2. Export:** `showcase/demo/index.ts`
```typescript
export { MyButton } from './buttons/my-button';
```

**3. Create docs:** `content/components/buttons/my-button.mdx`
```mdx
---
title: My Button
description: A custom button component
---

<ComponentPreview category="buttons" item="my-button" />
```

✅ Done! Route auto-generates at `/showcase/buttons/my-button`

---

## ⚡ OPTIMIZATION PATTERNS

### Pattern 1: Ref-Based DOM Updates
Use refs when you need frequent updates without re-renders:

```tsx
const elementRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handler = () => {
    const el = elementRef.current;
    if (el) el.textContent = getUpdatedValue();
  };
  
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

### Pattern 2: Hoisted Animation Variants
Create variants outside the component:

```tsx
const VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function MyComponent() {
  return <motion.div variants={VARIANTS} />;
}
```

### Pattern 3: RAF Throttling
Throttle expensive handlers:

```tsx
let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      doExpensiveWork();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });
```

### Pattern 4: Memoized Values
Memoize objects/arrays that affect dependencies:

```tsx
const { x, y } = useMemo(() => ({
  x: motionValue(0),
  y: motionValue(0),
}), []);

useEffect(() => {
  // x, y are stable across renders
  x.on('change', updateDOM);
}, [x, y]); // Safe to depend on now
```

---

## 🧪 TESTING CHECKLIST

Before committing changes:

- [ ] **Build:** `npm run build` succeeds
- [ ] **Types:** `npm run type-check` passes
- [ ] **Lint:** `npm run lint` passes
- [ ] **Performance:** No new console warnings
- [ ] **Accessibility:** Test with keyboard/screen reader
- [ ] **Mobile:** Responsive on all breakpoints
- [ ] **Dark/Light:** Theme toggle works smoothly

---

## 🚫 ANTI-PATTERNS (Avoid These)

| ❌ Anti-Pattern | ✅ Better Way | Why |
|---|---|---|
| Hardcoded navigation links | Config-driven (HEADER_NAV) | DRY, maintainable |
| State for every scroll | Refs + DOM updates | 95% fewer re-renders |
| Motion values per render | Memoized with useMemo | Stable references |
| Inline animation variants | Hoisted outside component | No per-render creation |
| String interpolation for classes | Use `cn()` helper | Proper Tailwind merging |
| Barrel imports (`/ui`) | Direct imports | Better tree-shaking |
| `suppressHydrationWarning` without reason | Document why | Prevents masking bugs |
| Using `Function()` for code | Pre-compile at build time | Security + performance |

---

## 📋 CODE REVIEW FOCUS AREAS

When reviewing PRs, check:

1. **Server vs Client**: Is `"use client"` truly needed?
2. **Re-renders**: Are there unnecessary state updates?
3. **Dependencies**: Are effect dependencies correct?
4. **Performance**: Any expensive operations in renders?
5. **Accessibility**: ARIA labels, keyboard navigation?
6. **Bundle Size**: Any heavy imports without dynamic loading?
7. **Type Safety**: Any `any` types that could be specific?

---

## 🔍 DEBUGGING TIPS

### Check Re-renders
Use React DevTools Profiler:
1. Open DevTools → Components tab
2. Click Profiler button
3. Record interactions
4. Look for unexpected re-renders

### Check Bundle Size
```bash
npm run build
# Check .next/static/ folder sizes
```

### Check Performance
```bash
npm run build && npm run start
# Open DevTools → Lighthouse → Generate report
```

### Check Hydration Issues
Look for these console warnings:
- "Expected server HTML to contain a matching..."
- "Did not expect server HTML to contain..."
- "Warning: Hydration mismatch"

**Fix:** Add mounting check with refs or `useEffect`

---

## 📚 USEFUL RESOURCES

- **Vercel Performance Guide:** https://vercel.com/docs/advanced/analytics
- **Next.js App Router:** https://nextjs.org/docs/app
- **React 19 Docs:** https://react.dev
- **Framer Motion:** https://www.framer.com/motion
- **Tailwind CSS:** https://tailwindcss.com/docs
- **A11y:** https://www.a11y-101.com/

---

## 🤝 CONTRIBUTING

### Before opening a PR:
1. ✅ Follow the patterns above
2. ✅ Run `npm run build` and `npm run type-check`
3. ✅ No `console.log` in production code
4. ✅ Add comments for non-obvious logic
5. ✅ Test on multiple devices

### Commit Message Format:
```
[feature|fix|perf|refactor]: Short description

- Bullet point 1
- Bullet point 2

Closes #123
```

---

## ❓ FAQ

**Q: When should I use `dynamic()`?**  
A: For components > 50KB, or components only used on certain pages.

**Q: Is Server Components slower?**  
A: No! They're faster — no JavaScript shipped to browser.

**Q: Should I use Redux?**  
A: Not needed for this project. Use context for small shared state.

**Q: How do I handle form submissions?**  
A: Use Server Actions: `"use server"` in a separate file.

**Q: Can I use TypeScript?**  
A: Yes! Everything should be typed.

---

## 📞 SUPPORT

- **Bug Reports:** Create a GitHub issue
- **Questions:** Start a discussion
- **Performance:** Profile with DevTools, create issue with details

---

**Happy coding! 🚀**
