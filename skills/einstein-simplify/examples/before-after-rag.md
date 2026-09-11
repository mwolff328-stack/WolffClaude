# Before / After: Vector Embeddings (RAG)

## Before

> "Then — and this is where it gets interesting — each chunk gets
> converted into what's called a vector embedding. A vector is just
> a list of numbers, but it's a very specific list of numbers that
> represents the meaning of that chunk. The model that generates
> these vectors is trained to put semantically similar content close
> together in this numerical space."

## After

> "Then each chunk gets converted into a set of numbers that
> represents its meaning. Think of it like GPS coordinates, but for
> meaning instead of location. Every chunk gets plotted as a point
> on a massive map. Things that mean similar things end up near each
> other on that map — even if the actual words are completely
> different. A chunk about 'configuring consent mode' and a chunk
> about 'setting up the consent manager' will end up right next to
> each other, because they mean the same thing. Those coordinates
> are called vector embeddings."

## Changes

| #   | Change                                                                       | Principle                         |
| --- | ---------------------------------------------------------------------------- | --------------------------------- |
| 1   | "this is where it gets interesting" removed                                  | Filler — the concept sells itself |
| 2   | GPS coordinates analogy inserted before technical description                | Analogy before description        |
| 3   | "vector embedding" label delayed until concept established                   | Concept before label              |
| 4   | "semantically similar content in numerical space" replaced with map metaphor | Replace jargon, don't define it   |
