# Claudio Network

Visualización interactiva de la red de personas mencionadas en **"Ascenso y Descenso de la Montaña Sagrada"** de Claudio Naranjo.

## Descripción

Este proyecto permite explorar las personas identificadas en el libro autobiográfico de Claudio Naranjo, visualizando sus relaciones, biografías y el contexto de sus menciones a través de un grafo interactivo.

### Características

- **Visualización de grafo interactivo**: Explora la red de relaciones con D3.js
- **Filtros dinámicos**: Ajusta la fuerza del vínculo para filtrar el grafo
- **Panel lateral**: Lista de personas con búsqueda y filtros avanzados
- **Fichas detalladas**: Biografías, fechas, relaciones y contexto de cada persona
- **Diseño responsive**: Funciona en escritorio y móvil

## Tecnologías

- **Next.js** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **D3.js** - Visualización de grafos

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
npm start
```

## Uso

1. Abre la aplicación en tu navegador (`http://localhost:3000`)
2. Usa el **slider de fuerza mínima** para filtrar qué personas aparecen en el grafo
3. **Haz clic en un nodo** para ver los detalles de la persona
4. **Arrastra los nodos** para reorganizar el grafo
5. Usa el **botón "Listado"** para abrir el panel de filtros y búsqueda

## Estructura del proyecto

```
claudio-network/
├── src/
│   ├── app/                    # Páginas de Next.js
│   ├── components/             # Componentes React
│   │   ├── NetworkGraph.tsx    # Visualización del grafo
│   │   ├── PersonaDetail.tsx   # Panel de detalle
│   │   └── SidePanel.tsx       # Panel de filtros
│   ├── lib/                    # Utilidades
│   ├── types/                  # Tipos TypeScript
│   └── data/                   # Datos estáticos
│       └── personas.json       # Base de datos de personas
└── public/                     # Archivos estáticos
```

## Datos

Los datos se han extraído del libro y enriquecido con información de fuentes públicas. Cada persona incluye:
- Nombre y variantes
- Tipo de relación con Claudio Naranjo
- Fuerza del vínculo (1-10)
- Biografía (cuando está disponible)
- Contexto de menciones en el libro
- Foto (cuando está disponible)

## Licencia

Este proyecto es de uso educativo y de investigación.

---

*Basado en "Ascenso y Descenso de la Montaña Sagrada" de Claudio Naranjo (1932-2019)*
