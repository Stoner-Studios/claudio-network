# GUÍA DE ENRIQUECIMIENTO DEL JSON DE PERSONAS

## Estado Actual

**Archivo:** `personas_naranjo_FINAL_ENRIQUECIDO.json`
- **Total de personas:** 738
- **Personas enriquecidas:** 6 (principales)
- **Personas pendientes:** 732

## Personas Ya Enriquecidas

1. **Tótila Albert** (220 menciones) - Maestro espiritual principal
2. **George Gurdjieff** (80 menciones) - Maestro espiritual (Cuarto Camino)
3. **Carlos Castaneda** (72 menciones) - Antropólogo, escritor
4. **Fritz Perls** (13 menciones) - Fundador Terapia Gestalt
5. **Óscar Ichazo** (12 menciones) - Maestro del Eneagrama
6. **Idries Shah** (21 menciones) - Maestro sufí, escritor

## Estructura de Datos por Persona

Cada persona en el JSON tiene los siguientes campos:

### Campos Básicos (todos tienen)
- `nombre`: Nombre completo
- `nombre_alternativo`: Lista de nombres alternativos
- `relacion`: Descripción de la relación con Claudio
- `tipo_relacion`: Categoría (25 tipos)
- `fuerza_vinculo`: Escala 1-10
- `nacionalidad`: País
- `origen_etnico`: Origen étnico
- `profesion`: Profesión
- `ubicacion`: Ubicación geográfica
- `caracteristicas`: Lista de características
- `epoca_relacion`: Período histórico
- `rol_en_vida_claudio`: Descripción del rol
- `num_menciones`: Número de veces mencionado
- `contextos_ejemplo`: Fragmentos del texto

### Campos de Enriquecimiento (solo personas principales)
- `biografia_extendida`: Biografía completa y detallada
- `wikipedia_url`: Enlace a Wikipedia o fuente biográfica
- `foto_url`: Enlace a foto o imagen
- `fecha_nacimiento`: YYYY-MM-DD
- `fecha_muerte`: YYYY-MM-DD (si aplica)
- `lugar_nacimiento`: Ciudad, País
- `lugar_muerte`: Ciudad, País (si aplica)
- `relaciones_con_otras_personas`: Array de relaciones

## Formato de Relaciones Entre Personas

```json
"relaciones_con_otras_personas": [
  {
    "nombre": "Nombre de la otra persona",
    "tipo": "maestro|discipulo|colaborador|amigo|esposa|hijo|etc",
    "descripcion": "Descripción breve de la relación"
  }
]
```

## Personas Prioritarias para Enriquecer

### Alta Prioridad (10+ menciones)

1. **Tarthang Tulku Rinpoche** (124 menciones) - Lama tibetano
2. **Marilyn** (103 menciones) - Compañera de Claudio
3. **Dee Dee** (34 menciones) - Pareja de Claudio
4. **Loreley** (38 menciones) - Pareja de Claudio
5. **Freddy Wang** (31 menciones) - Amigo músico
6. **Yogi Chen** (29 menciones) - Maestro yoga tántrico
7. **Eva María** (26 menciones) - Pareja de Freddy Wang
8. **Elisa** (18 menciones) - Amiga de la madre
9. **Héctor Fernández** (14 menciones) - Amigo, psicólogo chileno
10. **Alan Watts** (12 menciones) - Filósofo
11. **Frank Barron** (12 menciones) - Psicólogo
12. **Bob Hoffman** (13 menciones) - Creador Proceso Hoffman

### Prioridad Media (5-9 menciones)

- Jim Simkin - Terapeuta Gestalt
- Leo Zeff - Terapeuta psicodélico
- Abraham Maslow - Psicólogo humanista
- Michael Murphy - Co-fundador Esalen
- Dick Price - Co-fundador Esalen
- Claudio Arrau - Pianista chileno
- Julia Cohen - Madre de Claudio
- Vicente Naranjo - Padre de Claudio

## Proceso de Enriquecimiento

### 1. Búsqueda de Información

Para cada persona, buscar:
- Página de Wikipedia (idioma preferido: inglés, español)
- Biografías en sitios especializados
- Fotos en Wikimedia Commons o fuentes verificadas
- Fechas de nacimiento/muerte en bases de datos
- Relaciones con otras personas del libro

### 2. Redacción de Biografía Extendida

Incluir:
- Fechas y lugares de nacimiento/muerte
- Nacionalidad y orígenes
- Formación académica y profesional
- Principales logros y obras
- Contexto histórico relevante
- Conexión específica con Claudio Naranjo
- Relaciones con otras personas del círculo

**Extensión:** 150-300 palabras

### 3. Identificación de Relaciones

Buscar en el texto del libro menciones de:
- Maestro-discípulo
- Colaboraciones profesionales
- Amistades
- Relaciones familiares
- Conexiones institucionales (ej: ambos en Esalen)

### 4. Fuentes de Información Recomendadas

#### Generales:
- Wikipedia (en.wikipedia.org, es.wikipedia.org)
- Wikidata (wikidata.org)
- Wikimedia Commons (para fotos)

#### Psicología/Terapia:
- American Psychological Association (apa.org)
- Archives of American Psychology

#### Espiritualidad:
- Gurdjieff.org
- Arica.org
- Esalen.org

#### Música:
- AllMusic
- Discogs

#### Chile:
- Memoria Chilena (memoriachilena.gob.cl)
- Biblioteca Nacional de Chile

## Herramientas Útiles

### Búsqueda de Fotos
1. Wikipedia/Wikimedia Commons
2. Library of Congress (para figuras históricas)
3. University archives (para académicos)
4. Memoria Chilena (para chilenos)

### Verificación de Fechas
1. Wikidata
2. Find a Grave (findagrave.com)
3. Biographical databases

### Biografías
1. Wikipedia
2. Britannica
3. Stanford Encyclopedia of Philosophy (para filósofos)
4. Archive.org (libros antiguos)

## Ejemplo Completo de Persona Enriquecida

```json
{
  "nombre": "Tótila Albert",
  "nombre_alternativo": ["Totila Albert", "Tótila Albert Schneider"],
  "relacion": "Maestro espiritual principal",
  "tipo_relacion": "maestro_espiritual",
  "fuerza_vinculo": 10,
  "nacionalidad": "Chilena-Alemana",
  "origen_etnico": "Alemán-Chileno",
  "profesion": "Escultor, músico, poeta, maestro espiritual",
  "ubicacion": "Santiago, Chile / Berlín, Alemania",
  "caracteristicas": ["discípulo Gurdjieff", "músico", "escultor", "poeta", "Cuarto Camino"],
  "epoca_relacion": "1939-1967",
  "rol_en_vida_claudio": "Maestro espiritual fundamental, introductor al Cuarto Camino",
  "num_menciones": 220,
  "contextos_ejemplo": ["...", "..."],
  "biografia_extendida": "Escultor, músico y poeta chileno-alemán (1892-1967)...",
  "wikipedia_url": "https://www.memoriachilena.gob.cl/602/w3-article-348538.html",
  "foto_url": "https://www.memoriachilena.gob.cl/602/w3-article-341630.html",
  "fecha_nacimiento": "1892-11-30",
  "fecha_muerte": "1967-09-27",
  "lugar_nacimiento": "Santiago, Chile",
  "lugar_muerte": "Santiago, Chile",
  "relaciones_con_otras_personas": [
    {
      "nombre": "George Ivanovitch Gurdjieff",
      "tipo": "maestro",
      "descripcion": "Maestro espiritual de Tótila en el Cuarto Camino"
    },
    {
      "nombre": "Julia Cohen Gallerstein",
      "tipo": "anfitriona",
      "descripcion": "Madre de Claudio, lo alojó en su casa"
    }
  ]
}
```

## Progreso Sugerido

### Fase 1: Principales Maestros y Figuras (Semana 1)
- Completar 15 personas más mencionadas
- Foco en maestros espirituales y mentores profesionales

### Fase 2: Círculo Cercano (Semana 2)
- Familia
- Parejas
- Amigos íntimos
- Total: 20 personas

### Fase 3: Colaboradores y Colegas (Semana 3)
- Colegas profesionales
- Colaboradores en Esalen
- Psicólogos y terapeutas
- Total: 30 personas

### Fase 4: Figuras Culturales (Semana 4)
- Escritores
- Músicos
- Artistas
- Referencias culturales
- Total: 20 personas

## Notas Importantes

1. **Verificación:** Siempre verificar información en múltiples fuentes
2. **Copyright:** Solo usar fotos con licencia libre o dominio público
3. **Precisión:** Las fechas deben estar en formato ISO (YYYY-MM-DD)
4. **Relaciones:** Solo incluir relaciones verificables del libro o fuentes externas
5. **Objetividad:** Mantener tono neutral en biografías

## Métricas de Calidad

Una persona está "bien enriquecida" cuando tiene:
- ✅ Biografía extendida (150+ palabras)
- ✅ Al menos 1 URL de fuente verificable
- ✅ Fechas de nacimiento (y muerte si aplica)
- ✅ Al menos 2 relaciones mapeadas con otras personas
- ✅ Foto URL (deseable, no obligatorio)

## Contacto y Contribuciones

Este es un proyecto en progreso. El archivo JSON puede ser enriquecido de forma colaborativa.

**Próximos pasos sugeridos:**
1. Script automatizado para buscar en Wikipedia
2. API de Wikidata para obtener datos estructurados
3. OCR o parsing de fuentes biográficas especializadas
