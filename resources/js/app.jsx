import './bootstrap';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

createInertiaApp({
    title: (title) => `${title} - ALODO MPME - Portail Diagnostique`,
    resolve: (name) => {
        return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'))
    },
    setup: ({ App, props }) => {
        createRoot(document.getElementById('app')).render(<App {...props} />)
    },
})
