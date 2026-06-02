---
name: rog_refat_ptalter_web
description: Prompts para migrar o site rogreis.github.io para Jekyll
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Prompt de refatoração (executar agora, no código do projeto):

1. Navbar única
- Manter apenas uma navbar no layout.
- Ajustar somente o campo de texto da combo `#mytrackCombo` para herdar as cores padrão do Bootstrap (texto e fundo).
- Reduzir a largura do campo para não ocupar espaço excessivo em desktop e mobile.

2. Cores e estados dos links
- Padronizar a cor dos links conforme o estado visual do parágrafo (classe específica do parágrafo).
- Se a classe de estado não estiver presente, usar `parNormal` como fallback.
- Definir estados `:hover` e `:focus` com contraste suficiente e aparência consistente.

3. Links da árvore
- Aplicar estilo Bootstrap aos links da árvore.
- Garantir que o `:hover` dos links da árvore fique visível, sem conflito com o estilo global de links.

4. Seção Artigos e links via JSON
- Desabilitar a opção/entrada de “Artigos” na navegação atual.
- Criar os links dinamicamente com base no JSON do Rodam (mesma estrutura de dados já usada no projeto).

5. Link no título
- Tornar o título clicável apontando para o bilíngue da UF (usar a URL já definida no projeto; se houver mais de uma, usar a principal).

6. Destaque dos botões superiores
- Melhorar o destaque visual dos botões da parte superior (estado normal, hover e ativo), mantendo coerência com o tema Bootstrap.

Critérios de aceitação:
- Não quebrar navegação existente.
- Não alterar conteúdo textual das páginas, apenas comportamento/estilo/links.
- Garantir responsividade mínima em desktop e mobile.
- Listar ao final os arquivos alterados e um resumo objetivo de cada mudança.


Prompts para Migrar rogreis.github.io para Jekyll

Este documento reúne todos os prompts necessários para migrar o site rogreis.github.io para Jekyll, usando o Copilot dentro do VS Code.

1. Auditoria do Site Atual

Você é meu assistente técnico. Analise todos os arquivos deste projeto e gere um relatório detalhado contendo:

1. Estrutura atual do site rogreis.github.io
2. Problemas de organização, repetição de HTML, CSS antigo, links quebrados ou más práticas
3. O que pode ser reaproveitado na migração para Jekyll
4. O que deve ser reescrito
5. Sugestões de melhoria baseadas em boas práticas modernas

Quero um diagnóstico completo e acionável.

2. Criar Estrutura Inicial do Jekyll

Crie a estrutura completa de um projeto Jekyll dentro desta pasta, incluindo:

- _layouts/default.html
- _includes/header.html, footer.html, menu.html
- assets/css/style.css
- index.md
- about.md
- _config.yml configurado para GitHub Pages

Use boas práticas modernas e deixe tudo pronto para eu migrar o conteúdo.

3. Transformar HTML Antigo em Layouts e Includes

Pegue o HTML existente neste projeto e:

1. Identifique o que é repetido (header, footer, menu)
2. Extraia esses trechos para arquivos em _includes/
3. Crie um layout base em _layouts/default.html
4. Converta cada página HTML em arquivos .md usando front matter YAML
5. Garanta que todas as páginas usem o layout default

Explique o que foi feito e por quê.

4. Converter Conteúdo para Markdown

Converta o conteúdo das páginas HTML deste projeto para Markdown, mantendo:

- títulos
- parágrafos
- listas
- links
- imagens

E substitua o HTML antigo por arquivos .md limpos, usando front matter adequado.

5. Criar Sistema de Dados (Projetos, Portfólio, etc.)

Crie um arquivo _data/projetos.yml baseado nos conteúdos existentes no site.

Depois, gere um template em projetos.md que liste automaticamente todos os projetos usando Liquid.

Use um design simples e limpo.

6. Modernizar o CSS

Analise o CSS atual e gere um novo arquivo assets/css/style.css:

- mais limpo
- mais moderno
- responsivo
- sem estilos obsoletos
- com tipografia agradável
- com cores consistentes

Explique as melhorias feitas.

7. Revisar Tudo Antes do Deploy

Revise todo o projeto Jekyll gerado:

- verifique links
- verifique includes
- verifique layouts
- verifique front matter
- verifique referências a assets
- verifique erros comuns de Jekyll

Liste tudo o que precisa ser corrigido e faça as correções automaticamente.

8. Preparar Deploy no GitHub Pages

Configure o projeto para rodar perfeitamente no GitHub Pages:

- ajuste o _config.yml
- garanta compatibilidade com o build do GitHub
- remova plugins não suportados
- configure baseurl e url se necessário

Depois, gere instruções claras para o push final.

Observação

Use cada prompt conforme avança no processo de migração. Este arquivo serve como guia completo para transformar o site rogreis.github.io em um projeto Jekyll moderno, organizado e fácil de manter.
