<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">


        {{-- Apply the persisted theme before paint to avoid a flash of the wrong colors. --}}
        <script>
            (function () {
                try {
                    var stored = localStorage.getItem('vueuse-color-scheme') || 'auto';
                    var isDark = stored === 'dark' || (stored === 'auto' &&
                        window.matchMedia('(prefers-color-scheme: dark)').matches);
                    document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
            })();
        </script>

        @routes
        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        @inertiaHead
    </head>

    <body>
        @inertia
    </body>

</html>
