For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

When using client-side hooks (useState and useEffect) in a component that's being treated as a Server Component by Next.js, always add the "use client" directive at the top of the file.

Do not write code that will trigger this error: "Warning: Extra attributes from the server: %s%s""class, style"

By default, this template supports TSX syntax with Tailwind CSS classes, the shadcn/ui library, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

Use icons from lucide-react for logos.

Use stock photos from unsplash where appropriate, only valid URLs you know exist.

## Core Functionality

Here is the English translation of the requirements for the WeChat Reading plugin:

1. When clicking the plugin icon, a panel appears. All functionality must first verify if the domain is "https://weread.qq.com/". If not, the panel should display "Please use this plugin on the WeChat Reading website". If verified, the feature area will be shown.

2. Within the panel, users can customize the text color of the current browser tab using @rc-component/color-picker.

3. Within the panel, users can customize the background color of elements with the class name ".app_content" in the current browser tab using @rc-component/color-picker.

4. The panel includes an option to enable or disable the "Attention Assistant". When enabled, a transparent horizontal bar appears on the page.

5. Users can adjust the width, height, and opacity of the "Attention Assistant" by dragging circular buttons left and right within the panel.

6. The "Attention Assistant" has default settings of 100px height, #666666 background color, and 0.5 opacity.

7. The background color of the "Attention Assistant" can be selected using @rc-component/color-picker.

## Technical Specifications

- Node.js v22 specific features utilized
- Performance optimized with pnpm workspaces

## Development Workflow

- Use Node.js v22 native features
- Implement TypeScript for type safety
- ESM module support
- Strict type checking
- Use pnpm scripts for:
  - Development
  - Testing
  - Building
  - Deployment

## README.md Requirements

- Detailed Node.js and pnpm setup instructions
- Version compatibility guidelines
- Development environment setup
- Workspace management explanation
- Contribution guidelines focusing on Node.js v22 and pnpm

## Performance and Best Practices

- Leverage Node.js v22 performance improvements
- Efficient dependency management with pnpm
- Optimize bundle sizes

Develop a chrome extension for a better reading experience with a modern Node.js v22 and pnpm-powered development ecosystem.
