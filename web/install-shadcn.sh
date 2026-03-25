#!/bin/bash

# Install shadcn/ui components in groups

echo "Installing shadcn/ui components..."
pnpm dlx shadcn@latest init

# Group 1
echo "Installing group 1: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button"
npx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button

# Group 2
echo "Installing group 2: calendar, card, carousel, chart, checkbox, collapsible, command"
npx shadcn@latest add calendar card carousel chart checkbox collapsible command

# Group 3
echo "Installing group 3: context-menu, dialog, drawer, dropdown-menu, form, hover-card"
npx shadcn@latest add context-menu dialog drawer dropdown-menu form hover-card

# Group 4
echo "Installing group 4: input, input-otp, label, menubar, navigation-menu, pagination"
npx shadcn@latest add input input-otp label menubar navigation-menu pagination

# Group 5
echo "Installing group 5: popover, progress, radio-group, resizable, scroll-area, select"
npx shadcn@latest add popover progress radio-group resizable scroll-area select

# Group 6
echo "Installing group 6: separator, sheet, sidebar, skeleton, slider, sonner"
npx shadcn@latest add separator sheet sidebar skeleton slider sonner

# Group 7
echo "Installing group 7: switch, table, tabs, textarea, toggle, toggle-group, tooltip"
npx shadcn@latest add switch table tabs textarea toggle toggle-group tooltip

# Group 8
echo "Installing group 7: button-group empty field kbd item spinner"
npx shadcn@latest add button-group empty field kbd item spinner  


echo "All shadcn/ui components have been installed!"
