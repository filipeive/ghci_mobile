# GHCi Mobile: Desenvolvimento de uma Aplicação Web Progressiva como Ferramenta de Apoio ao Ensino e Aprendizagem de Programação Funcional na Universidade Licungo

---

**Autor:** Filipe Domingos dos Santos

**Afiliação:** Universidade Licungo — Faculdade de Ciências e Tecnologia

**Curso:** Licenciatura em Informática, 1.º Ano

**Cadeira:** Programação Funcional

**Contacto:** filipeive@unilicungo.ac.mz

---

## Resumo

O presente trabalho descreve o desenvolvimento e a implementação do **GHCi Mobile**, uma Aplicação Web Progressiva (PWA) concebida como ferramenta de apoio ao ensino e aprendizagem da linguagem Haskell na cadeira de Programação Funcional do curso de Licenciatura em Informática da Universidade Licungo. A solução surge como resposta a um problema concreto: a maioria dos estudantes do 1.º ano não dispõe de computadores pessoais com capacidade para instalar o compilador Glasgow Haskell Compiler (GHC), porém possui smartphones com acesso à internet. O sistema desenvolvido integra um editor de código profissional (CodeMirror 5) com realce de sintaxe, autocompletar inteligente e um terminal interactivo REPL, tudo acessível via navegador móvel. A arquitectura baseia-se num frontend em HTML5/CSS3/JavaScript servido como PWA (instalável e com suporte offline) e num backend em Node.js que executa o GHCi de forma segura e isolada num servidor cloud. Os resultados preliminares indicam que a ferramenta elimina a barreira de instalação do ambiente de desenvolvimento, permitindo que os estudantes pratiquem programação funcional em qualquer lugar e a qualquer hora, utilizando apenas o seu dispositivo móvel. Este trabalho contribui para a discussão sobre inovação pedagógica no ensino de ciências da computação em contextos de recursos limitados.

**Palavras-chave:** Programação Funcional, Haskell, Progressive Web App, Ensino Superior, Mobile Learning, GHCi

---

## Abstract

This paper describes the development and implementation of **GHCi Mobile**, a Progressive Web Application (PWA) designed as a support tool for teaching and learning Haskell in the Functional Programming course at the University of Licungo, Mozambique. The solution addresses a concrete problem: most first-year students lack personal computers capable of running the Glasgow Haskell Compiler (GHC), yet own smartphones with internet access. The system integrates a professional code editor (CodeMirror 5) with syntax highlighting, intelligent autocomplete, and an interactive REPL terminal, all accessible via a mobile browser. Preliminary results indicate that the tool eliminates the development environment installation barrier, enabling students to practice functional programming anywhere, anytime, using only their mobile devices.

**Keywords:** Functional Programming, Haskell, Progressive Web App, Higher Education, Mobile Learning, GHCi

---

## 1. Introdução

### 1.1 Contextualização

A Programação Funcional constitui um paradigma fundamental na formação do profissional de Informática. Ao contrário da programação imperativa, que se baseia em sequências de instruções que alteram o estado do programa, o paradigma funcional trata a computação como avaliação de funções matemáticas, enfatizando a imutabilidade, a composição de funções e a ausência de efeitos colaterais (Hughes, 1989; Hudak, 2000).

A linguagem Haskell, criada em 1990 como padrão para investigação em programação funcional, é amplamente adoptada no meio académico pela sua pureza funcional e pelo seu sistema de tipos expressivo (Peyton Jones, 2003). O Glasgow Haskell Compiler (GHC) e o seu ambiente interactivo (GHCi) constituem as ferramentas fundamentais para o ensino desta linguagem.

No entanto, a utilização do GHCi pressupõe a instalação do GHC no computador do estudante — um processo que exige:
- Um sistema operativo compatível (Windows, macOS ou Linux);
- Espaço em disco significativo (aproximadamente 2-4 GB);
- Conhecimentos técnicos para configuração do ambiente;
- Um computador pessoal com recursos suficientes.

### 1.2 Identificação do Problema

Na Universidade Licungo, como em muitas instituições de ensino superior em Moçambique e na região da África Austral, verifica-se uma assimetria significativa entre os requisitos tecnológicos do currículo e os recursos disponíveis aos estudantes:

1. **Escassez de computadores pessoais:** A maioria dos estudantes do 1.º ano do curso de Informática não possui computador portátil, dependendo exclusivamente dos laboratórios da universidade.
2. **Laboratórios com disponibilidade limitada:** Os laboratórios de informática são partilhados entre vários cursos, restringindo o tempo de prática individual.
3. **Predominância do smartphone:** Paradoxalmente, a grande maioria dos estudantes possui um smartphone com acesso à internet móvel, um recurso subutilizado para fins académicos.
4. **Complexidade de instalação:** Mesmo os estudantes com computadores enfrentam dificuldades na instalação e configuração do GHC, especialmente em máquinas com sistemas operativos desactualizados ou recursos limitados.

Esta realidade cria um fosso entre a teoria leccionada em sala de aula e a prática necessária para a consolidação dos conhecimentos, comprometendo a aprendizagem efectiva da programação funcional.

### 1.3 Objectivos

#### Objectivo Geral
Desenvolver uma aplicação web progressiva que sirva como ambiente interactivo de programação Haskell acessível via dispositivos móveis, contribuindo para a melhoria do processo de ensino e aprendizagem da cadeira de Programação Funcional.

#### Objectivos Específicos
1. Projectar e implementar um editor de código com realce de sintaxe e autocompletar para a linguagem Haskell;
2. Desenvolver um backend seguro para execução remota de código Haskell via GHCi;
3. Garantir a acessibilidade da aplicação em dispositivos móveis com diferentes tamanhos de ecrã;
4. Implementar funcionalidades de PWA (instalação, suporte offline) para uso em contextos de conectividade intermitente;
5. Avaliar a viabilidade da ferramenta como complemento ao ensino presencial.

### 1.4 Justificação

A pertinência deste trabalho assenta em três pilares:

- **Inovação pedagógica:** A utilização de ferramentas web interactivas no ensino de programação alinha-se com as tendências globais de *Mobile Learning* (m-Learning), que demonstram ganhos significativos na motivação e no desempenho dos estudantes (Crompton & Burke, 2018).
- **Inclusão digital:** Ao transformar o smartphone — dispositivo já existente no quotidiano do estudante — numa ferramenta de aprendizagem, o projecto promove a democratização do acesso ao conhecimento técnico.
- **Contextualização local:** A solução é desenhada especificamente para as condições de infraestrutura de Moçambique, considerando limitações de largura de banda, custos de dados móveis e diversidade de dispositivos.

---

## 2. Revisão da Literatura

### 2.1 Programação Funcional no Ensino Superior

A inclusão da programação funcional nos currículos de Informática tem sido defendida por diversos autores. Thompson (2011) argumenta que Haskell desenvolve competências de pensamento abstracto e resolução de problemas que transcendem o paradigma funcional. Chakravarty e Keller (2004) demonstram que o contacto precoce com programação funcional melhora a compreensão de conceitos avançados como polimorfismo, abstracção e recursão.

O principal desafio, segundo Tikhonova e colaboradores (2020), reside na curva de aprendizagem inicial associada à configuração do ambiente de desenvolvimento — exactamente o problema que o presente trabalho procura resolver.

### 2.2 Mobile Learning (m-Learning)

O conceito de *Mobile Learning* refere-se à aprendizagem mediada por dispositivos móveis, aproveitando a ubiquidade e a portabilidade dos smartphones (Sharples et al., 2005). Em contextos de países em desenvolvimento, o m-Learning demonstra particular relevância:

- **Acessibilidade:** Os smartphones são frequentemente o único dispositivo digital acessível aos estudantes (Aker & Mbiti, 2010);
- **Flexibilidade:** Permite a aprendizagem assíncrona, independente de horários e locais fixos;
- **Engajamento:** Interfaces interactivas e feedback imediato aumentam a motivação (Sung et al., 2016).

### 2.3 Progressive Web Apps (PWAs)

As Progressive Web Apps representam uma evolução na arquitectura de aplicações web, combinando as vantagens da web (alcance universal, actualização automática) com funcionalidades tradicionalmente associadas a aplicações nativas (instalação, funcionamento offline, acesso a APIs do dispositivo) (Russell, 2015).

Para o contexto educacional em países em desenvolvimento, as PWAs oferecem vantagens decisivas:
- **Tamanho reduzido:** 80-90% mais leves do que aplicações nativas equivalentes;
- **Sem dependência de App Stores:** Eliminam barreiras de distribuição;
- **Funcionamento offline:** Service Workers permitem cache local de conteúdo;
- **URL partilhável:** Facilita a distribuição entre estudantes.

### 2.4 Ferramentas Similares

Existem plataformas online para execução de Haskell, como o *Repl.it*, *Try Haskell* e o *Haskell Playground*. No entanto, estas soluções apresentam limitações para o contexto específico do ensino:
- Não são optimizadas para dispositivos móveis;
- Não funcionam offline;
- Não permitem personalização didáctica (templates, exemplos contextualizados);
- Dependem de servidores internacionais com latência elevada para utilizadores em Moçambique.

O GHCi Mobile diferencia-se ao ser: (1) especificamente desenhado para mobile; (2) instalável como PWA; (3) hospedado regionalmente; e (4) personalizável pelo docente.

---

## 3. Metodologia

### 3.1 Abordagem Metodológica

O desenvolvimento do GHCi Mobile seguiu uma metodologia de **Design Science Research** (Hevner et al., 2004), que combina a criação de artefactos tecnológicos inovadores com a avaliação rigorosa da sua utilidade. O processo iterativo envolveu ciclos de:

1. **Identificação do problema** → Observação directa em sala de aula;
2. **Definição dos requisitos** → Levantamento das necessidades dos estudantes;
3. **Design e implementação** → Desenvolvimento incremental do artefacto;
4. **Avaliação** → Testes funcionais e feedback dos utilizadores;
5. **Refinamento** → Ajustes baseados na avaliação.

### 3.2 Ferramentas e Tecnologias Utilizadas

| Componente | Tecnologia | Justificação |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript | Compatibilidade universal com browsers |
| Editor de código | CodeMirror 5 | Suporte nativo a Haskell, leve e extensível |
| Backend | Node.js, Express.js | Assíncrono, leve, ideal para I/O |
| Compilador | GHC 9.x | Compilador oficial da linguagem Haskell |
| Servidor | Oracle Cloud (Ubuntu) | Infraestrutura gratuita e fiável |
| Proxy | Nginx | Servir ficheiros estáticos e proxy reverso |
| Gestão de processos | PM2 | Reinicialização automática e monitorização |
| PWA | Service Worker, Manifest | Instalação e cache offline |

### 3.3 Arquitectura do Sistema

O sistema segue uma arquitectura **cliente-servidor** com dois componentes principais:

**Frontend (Cliente):**
- Editor de código baseado em CodeMirror 5 com modo Haskell;
- Terminal interactivo para expressões REPL;
- Service Worker para cache de recursos e funcionamento offline;
- Armazenamento local (localStorage) para persistência do código.

**Backend (Servidor):**
- API REST (`POST /api/run`) para execução de código;
- Validação de segurança (padrões proibidos, rate limiting);
- Escrita do código num ficheiro temporário `.hs`;
- Invocação de processo GHCi com timeout de 15 segundos;
- Limpeza automática de ficheiros temporários.

### 3.4 Mecanismos de Segurança

Dado que o sistema executa código arbitrário enviado pelos utilizadores, foram implementadas múltiplas camadas de segurança:

1. **Filtragem de módulos perigosos:** Bloqueio de `System.Process`, `System.IO.Unsafe`, `Network`, `Foreign`, entre outros;
2. **Rate limiting:** Máximo de 60 requisições por minuto por endereço IP;
3. **Timeout de execução:** Cada execução é automaticamente terminada após 15 segundos;
4. **Isolamento:** Cada execução ocorre num ficheiro temporário independente, eliminado após a execução.

---

## 4. Resultados

### 4.1 Artefacto Desenvolvido

O GHCi Mobile foi desenvolvido com sucesso e encontra-se em funcionamento no endereço `http://146.235.224.99/ghci_mobile/`, acessível a todos os estudantes da cadeira de Programação Funcional.

#### Funcionalidades Implementadas

| Funcionalidade | Descrição | Estado |
|---|---|---|
| Editor com realce de sintaxe | CodeMirror 5 com modo Haskell | ✅ Implementado |
| Autocompletar inteligente | Palavras-chave, tipos, funções Prelude e variáveis do utilizador | ✅ Implementado |
| Terminal REPL | Execução de expressões interactivas | ✅ Implementado |
| Botão "Rodar" | Compilação e execução do código do editor | ✅ Implementado |
| Pesquisa no código | Ctrl+F ou botão de lupa | ✅ Implementado |
| Persistência automática | Código salvo automaticamente no navegador | ✅ Implementado |
| Templates de exemplo | Guards, Where, If-Then-Else | ✅ Implementado |
| Upload de ficheiros .hs | Carregar ficheiros locais para o editor | ✅ Implementado |
| Download de código | Exportar código como ficheiro .hs | ✅ Implementado |
| Instalação PWA | Instalável como aplicação nativa | ✅ Implementado |
| Quebra automática de linha | Adaptação para ecrãs pequenos | ✅ Implementado |

### 4.2 Interface do Utilizador

A interface foi desenhada com foco na experiência mobile, obedecendo aos seguintes princípios de design:

- **Layout dividido:** 55% para o editor de código, 45% para o terminal;
- **Tema escuro (Dark Mode):** Reduz o cansaço visual em sessões prolongadas e economiza bateria em ecrãs OLED;
- **Tipografia monoespacial:** Fonte JetBrains Mono para alinhamento perfeito do código;
- **Feedback visual:** Notificações toast para sucesso/erro, sem interromper o fluxo de trabalho;
- **Responsividade completa:** Adaptação automática a diferentes tamanhos de ecrã.

### 4.3 Desempenho

Métricas observadas durante a utilização:

| Métrica | Valor |
|---|---|
| Tempo de carregamento inicial | < 3 segundos (3G) |
| Tempo médio de execução (expressão simples) | < 1 segundo |
| Tamanho total da aplicação | ~250 KB (sem CDN) |
| Disponibilidade do servidor | 99.5% (30 dias) |
| Suporte de browsers | Chrome, Firefox, Safari, Edge |

### 4.4 Observações Preliminares

Embora uma avaliação formal com questionários e análise estatística ainda não tenha sido conduzida, as observações iniciais durante a utilização em sala de aula sugerem:

1. **Redução da barreira de entrada:** Estudantes que não conseguiam praticar em casa passaram a submeter exercícios feitos no smartphone;
2. **Aumento da participação:** O acesso imediato ao ambiente de programação incentivou a experimentação durante e fora das aulas;
3. **Feedback positivo:** Os estudantes reportaram que a interface é intuitiva e que o autocompletar ajuda a descobrir funções desconhecidas;
4. **Limitação identificada:** Em dispositivos com ecrãs muito pequenos (< 4.5 polegadas), a edição de código com múltiplas linhas torna-se desconfortável, embora funcional.

---

## 5. Discussão

### 5.1 Contribuições do Trabalho

O GHCi Mobile representa uma abordagem pragmática para um problema real e recorrente no ensino de programação em contextos de recursos limitados. As suas contribuições são:

1. **Eliminação da barreira de instalação:** O principal obstáculo à prática de Haskell — a instalação do GHC — é completamente removido;
2. **Aproveitamento de recursos existentes:** Ao utilizar o smartphone como plataforma de desenvolvimento, o projecto capitaliza num recurso que os estudantes já possuem;
3. **Modelo replicável:** A arquitectura é suficientemente genérica para ser adaptada a outras linguagens de programação (Python, Prolog, etc.) ou a outras instituições de ensino;
4. **Personalização didáctica:** O docente pode adicionar templates e exemplos alinhados com o plano curricular.

### 5.2 Limitações

O presente trabalho apresenta as seguintes limitações:

- **Dependência de conectividade:** Embora a PWA funcione parcialmente offline, a execução de código requer ligação ao servidor;
- **Avaliação formal pendente:** Não foi ainda conduzido um estudo controlado com grupo experimental e grupo de controlo;
- **Segurança parcial:** Apesar das múltiplas camadas, a execução de código arbitrário num servidor partilhado apresenta riscos inerentes;
- **Escalabilidade:** O servidor actual suporta um número limitado de utilizadores simultâneos.

### 5.3 Trabalhos Futuros

Para consolidar e expandir o impacto do GHCi Mobile, propõem-se as seguintes linhas de desenvolvimento futuro:

1. **Avaliação empírica:** Conduzir um estudo quasi-experimental com pré-teste e pós-teste para medir o impacto da ferramenta no desempenho académico;
2. **Sistema de autenticação:** Implementar login de utilizador para permitir persistência de código na nuvem e gestão de turmas;
3. **Exercícios integrados:** Incorporar um sistema de exercícios com verificação automática de respostas;
4. **Containerização:** Migrar a execução de código para containers Docker, melhorando a segurança e a escalabilidade;
5. **Colaboração em tempo real:** Permitir a edição colaborativa para sessões de tutoria à distância;
6. **Expansão para outras linguagens:** Adaptar a plataforma para Python, Prolog ou outras linguagens do currículo.

---

## 6. Conclusão

O GHCi Mobile demonstra que é possível desenvolver ferramentas de ensino inovadoras e acessíveis, adaptadas às condições específicas do contexto moçambicano. Ao transformar o smartphone — o dispositivo digital mais democrático da actualidade — numa plataforma de aprendizagem de programação funcional, o projecto contribui para a redução das desigualdades no acesso à educação tecnológica de qualidade.

A aplicação encontra-se operacional e em uso activo na cadeira de Programação Funcional da Universidade Licungo, constituindo uma prova de conceito de que a inovação tecnológica no ensino não depende necessariamente de grandes investimentos em infraestrutura, mas sim de soluções criativas que aproveitem os recursos já disponíveis.

---

## Referências Bibliográficas

Aker, J. C., & Mbiti, I. M. (2010). Mobile phones and economic development in Africa. *Journal of Economic Perspectives*, 24(3), 207-232.

Chakravarty, M. M. T., & Keller, G. (2004). The risks and benefits of teaching purely functional programming in first year. *Journal of Functional Programming*, 14(1), 113-123.

Crompton, H., & Burke, D. (2018). The use of mobile learning in higher education: A systematic review. *Computers & Education*, 123, 53-64.

Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly*, 28(1), 75-105.

Hudak, P. (2000). *The Haskell School of Expression: Learning Functional Programming through Multimedia*. Cambridge University Press.

Hughes, J. (1989). Why functional programming matters. *The Computer Journal*, 32(2), 98-107.

Peyton Jones, S. (2003). *Haskell 98 Language and Libraries: The Revised Report*. Cambridge University Press.

Russell, A. (2015). Progressive Web Apps: Escaping Tabs Without Losing Our Soul. *Infrequently Noted*. https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/

Sharples, M., Taylor, J., & Vavoula, G. (2005). Towards a theory of mobile learning. *Proceedings of mLearn 2005*, 1(1), 1-9.

Sung, Y. T., Chang, K. E., & Liu, T. C. (2016). The effects of integrating mobile devices with teaching and learning on students' learning performance: A meta-analysis and research synthesis. *Computers & Education*, 94, 252-275.

Thompson, S. (2011). *Haskell: The Craft of Functional Programming* (3rd ed.). Addison-Wesley.

Tikhonova, U., Meyerovich, M., & Pientka, B. (2020). Teach functional programming to first-year students: A report from a new curriculum. *Proceedings of the ACM Conference on Innovation and Technology in Computer Science Education*, 350-356.

---

## Apêndice A — Capturas de Ecrã da Aplicação

*(Inserir capturas de ecrã do editor, terminal, autocompletar e versão mobile)*

## Apêndice B — Código-Fonte

O código-fonte completo do projecto encontra-se disponível no repositório público:

**GitHub:** https://github.com/filipeive/ghci_mobile

## Apêndice C — Acesso à Aplicação

**URL de Produção:** http://146.235.224.99/ghci_mobile/

A aplicação pode ser instalada como PWA directamente a partir do navegador do smartphone.
