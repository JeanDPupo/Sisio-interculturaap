# Changelog

## [Unreleased]

### Fixed
- **Registro de usuarios (web)**: Se eliminó el bloqueo que impedía registrar usuarios desde la web.
  El problema estaba en `OnboardingPage.tsx` — mostraba un mensaje "La funcionalidad de registro
  está disponible al iniciar sesión en la aplicación móvil..." en vez del formulario de registro.
  
  **Diagnóstico**: El backend (`POST /api/auth/register`) estaba completamente funcional. La capa
  compartida (`apiService.ts`, `useAuth.ts`, `userStore.ts`) también tenía todo implementado.
  El bloqueo era exclusivamente en la UI web de onboarding.
  
  **Cambio**: Se reemplazó el mensaje de bloqueo con un formulario completo de registro
  (nombre, email, contraseña, confirmar contraseña) que llama al hook `register()` de `useAuth`.

- **setAccessToken faltante en register hook**: `useAuth.ts` — la función `register()` no llamaba
  a `apiService.setAccessToken()` a diferencia de `login()`. Después de registrar, las llamadas
  API subsiguientes fallaban por falta de token en headers.

- **Web .env.local**: Se creó `packages/web/.env.local` desde `.env.example` para que el frontend
  pueda conectar con el backend.

- **Mobile: App.tsx reconectada a screens reales**: Las 11 pantallas estaban definidas como
  componentes placeholder inline (`<div>Placeholder</div>`) en vez de importar los archivos reales
  de `./screens/`. Se reemplazaron con imports correctos.

- **Mobile: RegisterScreen creado**: No existía pantalla de registro. `LoginScreen.tsx:38`
  navegaba a `'Register'` pero el archivo no existía. Se creó `RegisterScreen.tsx` con formulario
  completo (nombre, email, contraseña, confirmar) y se añadió al barrel export y al stack de
  navegación.

- **Web: `user.role` → `user.is_admin`**: El type `User` no tiene campo `role`, usa `is_admin`.
  Seis lugares en `AdminPage.tsx`, `Navigation.tsx` y `ProfilePage.tsx` usaban `user?.role`,
  rompiendo el panel de administración (siempre retornaba `undefined`, nunca admin).
