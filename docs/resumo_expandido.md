# Resumo Expandido

---

**Título:** GHCi Mobile: Desenvolvimento de uma Aplicação Web Progressiva como Ferramenta de Apoio ao Ensino e Aprendizagem de Programação Funcional na Universidade Licungo

**Autor:** Filipe Domingos dos Santos

**Afiliação:** Universidade Licungo — Faculdade de Ciências e Tecnologia

**Palavras-chave:** Programação Funcional, Haskell, Progressive Web App, Mobile Learning, Ensino Superior

---

## Introdução e Problema

O ensino da programação funcional através da linguagem Haskell no curso de Licenciatura em Informática da Universidade Licungo enfrenta uma barreira concreta: a instalação e configuração do Glasgow Haskell Compiler (GHC) requer um computador pessoal com recursos significativos — recurso que a maioria dos estudantes do 1.º ano não possui. No entanto, observa-se que a quase totalidade dos estudantes possui smartphones com acesso à internet móvel, constituindo um recurso tecnológico subutilizado para fins académicos.

## Objectivo

Desenvolver uma Aplicação Web Progressiva (PWA) denominada **GHCi Mobile** que disponibilize um ambiente interactivo de programação Haskell acessível via navegador de dispositivos móveis, eliminando a necessidade de instalação local do compilador e permitindo que os estudantes pratiquem programação funcional em qualquer lugar.

## Metodologia

O desenvolvimento seguiu a abordagem de Design Science Research, com ciclos iterativos de design, implementação e avaliação. O sistema foi construído com uma arquitectura cliente-servidor: o frontend utiliza HTML5, CSS3 e JavaScript com o editor CodeMirror 5 (com realce de sintaxe Haskell e autocompletar inteligente); o backend utiliza Node.js/Express para invocação segura do GHCi num servidor Oracle Cloud. A aplicação foi concebida como PWA, sendo instalável como aplicação nativa e com suporte parcial offline via Service Workers.

## Resultados

O GHCi Mobile encontra-se operacional e acessível online, oferecendo: (1) editor profissional com realce de sintaxe e autocompletar para palavras-chave, tipos e funções Haskell; (2) terminal interactivo REPL; (3) templates didácticos de exemplos (Guards, Where, If-Then-Else); (4) persistência automática do código no navegador; (5) funcionalidade de pesquisa integrada; (6) design responsivo optimizado para ecrãs de smartphones. As observações preliminares em contexto de sala de aula indicam que a ferramenta reduziu a barreira de entrada à prática de Haskell e incentivou a experimentação fora do horário lectivo.

## Conclusão

O GHCi Mobile demonstra a viabilidade de soluções web progressivas como ferramentas de apoio ao ensino de programação em contextos de recursos limitados. Ao capitalizar no smartphone — dispositivo já presente no quotidiano dos estudantes — a aplicação contribui para a democratização do acesso ao conhecimento técnico, alinhando-se com os princípios de inclusão digital e inovação pedagógica.

---

*Repositório do projecto:* https://github.com/filipeive/ghci_mobile

*Aplicação em produção:* http://146.235.224.99/ghci_mobile/
