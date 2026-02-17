// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: '/build/', // 👈 important so paths start with /build/
//   build: {
//     outDir: '../backend/public/build', // 👈 build into /public/build
//     emptyOutDir: true,
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
