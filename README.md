# Claudio Network

Visualización interactiva de la red de personas mencionadas en **"Ascenso y Descenso de la Montaña Sagrada"** de Claudio Naranjo.

## Descripción

Este proyecto permite explorar las 541 personas identificadas en el libro autobiográfico de Claudio Naranjo, visualizando sus relaciones, biografías y el contexto de sus menciones.

### Características

- **Visualización de grafo interactivo**: Explora la red de relaciones entre las personas más mencionadas
- **Vista de lista**: Navega por todas las personas con filtros y búsqueda
- **Fichas detalladas**: Biografías, fechas, relaciones y contexto de cada persona
- **Filtros dinámicos**: Ajusta el número mínimo de menciones para filtrar el grafo

## Datos

| Métrica | Valor |
|---------|-------|
| Total de personas | 541 |
| Personas con biografía | 30 |
| Personas con relaciones mapeadas | 27 |
| Relaciones identificadas | 60+ |

### Top 10 personas más mencionadas

1. **Tótila Albert** (220 menciones) - Maestro espiritual principal
2. **Tarthang Tulku Rinpoche** (124 menciones) - Lama tibetano
3. **Marilyn** (103 menciones) - Compañera
4. **George Gurdjieff** (80 menciones) - Maestro espiritual (Cuarto Camino)
5. **Carlos Castaneda** (72 menciones) - Antropólogo y escritor
6. **María** (59 menciones) - Persona del círculo cercano
7. **Loreley** (38 menciones) - Pareja de Claudio
8. **Dee Dee** (34 menciones) - Pareja de Claudio
9. **Francisco** (32 menciones) - Persona mencionada
10. **Freddy Wang** (31 menciones) - Amigo músico

## Estructura del proyecto

```
claudio-network/
├── src/
│   ├── app/                    # Páginas de Next.js
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página principal
│   ├── components/             # Componentes React
│   │   ├── NetworkGraph.tsx    # Visualización del grafo con D3.js
│   │   └── PersonaDetail.tsx   # Modal de detalle de persona
│   ├── lib/                    # Utilidades
│   │   └── graphData.ts        # Funciones de datos y grafo
│   ├── types/                  # Tipos TypeScript
│   │   └── persona.ts          # Interfaces de datos
│   └── data/                   # Datos estáticos
│       └── personas.json       # Base de datos de personas
├── data/                       # Datos originales
│   └── personas.json           # Backup de datos
├── docs/                       # Documentación
│   ├── GUIA_ENRIQUECIMIENTO.md # Guía para enriquecer datos
│   └── RESUMEN_FINAL_ENRIQUECIDO.md
└── public/                     # Archivos estáticos
```

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

## Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **D3.js** - Visualización de grafos

## Uso

1. Abre la aplicación en tu navegador (`http://localhost:3000`)
2. Usa el **slider de menciones mínimas** para filtrar qué personas aparecen en el grafo
3. **Haz clic en un nodo** para ver los detalles de la persona
4. **Arrastra los nodos** para reorganizar el grafo
5. Cambia entre **vista de grafo** y **vista de lista** con los botones superiores
6. Usa el **buscador** para encontrar personas específicas

## Contribuir

Para enriquecer la base de datos con más biografías y relaciones, consulta la guía en `docs/GUIA_ENRIQUECIMIENTO.md`.

## Licencia

Este proyecto es de uso educativo y de investigación. Los datos biográficos provienen de fuentes públicas como Wikipedia.

---

*Basado en "Ascenso y Descenso de la Montaña Sagrada" de Claudio Naranjo (1932-2019)*
