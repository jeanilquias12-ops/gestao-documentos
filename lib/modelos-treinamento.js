/* Modelos de certificado por norma (NR). Usado pelo sistema (turmas, lista de presença)
   e por certificado-nr18.html (frente/verso). O conteúdo programático vem do texto das NR:
   - NR-01, item 1.7.1.1: o certificado leva nome e assinatura do trabalhador, conteúdo
     programático, carga horária, data, local, nome e qualificação dos instrutores e assinatura
     do responsável técnico;
   - cada modelo cita o item da NR de onde saiu o conteúdo e a carga mínima.
   NR-18 continua no modelo original (RQ-116.01) dentro de certificado-nr18.html. */
(function (root) {
  const ROTULO_MODALIDADE = { inicial: 'Inicial', periodico: 'Periódico', eventual: 'Eventual' };
  const TRES = ['inicial', 'periodico', 'eventual'];

  const MODELOS = [
    {
      key: 'nr05', curto: 'CIPA', nr: 'NR-05', nome: 'NR-05 — CIPA (Comissão Interna de Prevenção de Acidentes e de Assédio)',
      norma: 'a Norma Regulamentadora NR-05 (Comissão Interna de Prevenção de Acidentes e de Assédio – CIPA)',
      titulo: 'Treinamento de Membro da Comissão Interna de Prevenção de Acidentes e de Assédio (CIPA)',
      modalidades: ['inicial'],
      // 5.7.4: 8 h (grau de risco 1), 12 h (2), 16 h (3), 20 h (4); 8 h para o designado
      cargaMin: { inicial: 8 },
      avisoCarga: 'NR-05, item 5.7.4: 8 h (grau de risco 1), 12 h (2), 16 h (3) ou 20 h (4); designado da NR-05: 8 h.',
      validadeMeses: null,
      base: 'NR-05, item 5.7.2',
      conteudo: [
        'Estudo do ambiente, das condições de trabalho, bem como dos riscos originados do processo produtivo.',
        'Noções sobre acidentes e doenças relacionadas ao trabalho decorrentes das condições de trabalho e da exposição aos riscos existentes no estabelecimento e suas medidas de prevenção.',
        'Metodologia de investigação e análise de acidentes e doenças relacionadas ao trabalho.',
        'Princípios gerais de higiene do trabalho e de medidas de prevenção dos riscos.',
        'Noções sobre as legislações trabalhista e previdenciária relativas à segurança e saúde no trabalho.',
        'Noções sobre a inclusão de pessoas com deficiência e reabilitados nos processos de trabalho.',
        'Organização da CIPA e outros assuntos necessários ao exercício das atribuições da Comissão.',
        'Prevenção e combate ao assédio sexual e a outras formas de violência no trabalho.'
      ],
      programaLista: 'NR-05 (item 5.7.2): ambiente e condições de trabalho e riscos do processo produtivo; acidentes e doenças relacionadas ao trabalho e prevenção; investigação e análise de acidentes; higiene do trabalho; legislação trabalhista e previdenciária de SST; inclusão de pessoas com deficiência; organização da CIPA; prevenção e combate ao assédio sexual e a outras formas de violência no trabalho.'
    },
    {
      key: 'nr06', curto: 'EPI', nr: 'NR-06', nome: 'NR-06 — Equipamento de Proteção Individual (EPI)',
      norma: 'a Norma Regulamentadora NR-06 (Equipamentos de Proteção Individual – EPI)',
      titulo: 'Treinamento sobre Equipamento de Proteção Individual (EPI)',
      modalidades: ['inicial'],
      cargaMin: null, validadeMeses: null,
      base: 'NR-06, itens 6.7.2 e 6.7.2.1',
      conteudo: [
        'Descrição do equipamento e seus componentes.',
        'Risco ocupacional contra o qual o EPI oferece proteção.',
        'Restrições e limitações de proteção.',
        'Forma adequada de uso e ajuste.',
        'Manutenção e substituição.',
        'Cuidados de limpeza, higienização, guarda e conservação.'
      ],
      programaLista: 'NR-06 (item 6.7.2): descrição do EPI e seus componentes; risco ocupacional contra o qual o EPI protege; restrições e limitações de proteção; forma adequada de uso e ajuste; manutenção e substituição; limpeza, higienização, guarda e conservação.'
    },
    {
      key: 'nr10', curto: 'Básico', nr: 'NR-10', nome: 'NR-10 — Curso Básico: Segurança em Instalações e Serviços com Eletricidade (40 h)',
      norma: 'a Norma Regulamentadora NR-10 (Segurança em Instalações e Serviços em Eletricidade) – Anexo III',
      titulo: 'Curso Básico – Segurança em Instalações e Serviços com Eletricidade',
      modalidades: TRES,
      cargaMin: { inicial: 40 }, avisoCarga: 'NR-10, Anexo III: curso básico com no mínimo 40 h (trabalhadores autorizados). Reciclagem a cada 2 anos, com carga conforme a situação (10.8.8.2 e 10.8.8.3).',
      validadeMeses: 24,
      base: 'NR-10, item 10.8.8 e Anexo III (1)',
      conteudo: [
        'Introdução à segurança com eletricidade.',
        'Riscos em instalações e serviços com eletricidade: a) o choque elétrico, mecanismos e efeitos; b) arcos elétricos, queimaduras e quedas; c) campos eletromagnéticos.',
        'Técnicas de análise de risco.',
        'Medidas de controle do risco elétrico: desenergização; aterramento funcional (TN/TT/IT), de proteção e temporário; equipotencialização; seccionamento automático da alimentação; dispositivos a corrente de fuga; extra baixa tensão; barreiras e invólucros; bloqueios e impedimentos; obstáculos e anteparos; isolamento das partes vivas; isolação dupla ou reforçada; colocação fora de alcance; separação elétrica.',
        'Normas Técnicas Brasileiras – NBR da ABNT: NBR-5410, NBR 14039 e outras.',
        'Regulamentações do MTE: a) NRs; b) NR-10; c) qualificação, habilitação, capacitação e autorização.',
        'Equipamentos de proteção coletiva.',
        'Equipamentos de proteção individual.',
        'Rotinas de trabalho – procedimentos: a) instalações desenergizadas; b) liberação para serviços; c) sinalização; d) inspeções de áreas, serviços, ferramental e equipamento.',
        'Documentação de instalações elétricas.',
        'Riscos adicionais: altura; ambientes confinados; áreas classificadas; umidade; condições atmosféricas.',
        'Proteção e combate a incêndios: noções básicas; medidas preventivas; métodos de extinção; prática.',
        'Acidentes de origem elétrica: causas diretas e indiretas; discussão de casos.',
        'Primeiros socorros: noções sobre lesões; priorização do atendimento; aplicação de respiração artificial; massagem cardíaca; técnicas para remoção e transporte de acidentados; práticas.',
        'Responsabilidades.'
      ],
      programaLista: 'NR-10 Anexo III – Curso Básico: introdução à segurança com eletricidade; riscos (choque, arcos, campos eletromagnéticos); análise de risco; medidas de controle do risco elétrico; normas ABNT; regulamentações do MTE; EPC e EPI; rotinas e procedimentos de trabalho; documentação; riscos adicionais; combate a incêndios; acidentes de origem elétrica; primeiros socorros; responsabilidades.'
    },
    {
      key: 'nr10sep', curto: 'Complementar SEP', nr: 'NR-10', nome: 'NR-10 — Curso Complementar: Segurança no Sistema Elétrico de Potência – SEP (40 h)',
      norma: 'a Norma Regulamentadora NR-10 (Segurança em Instalações e Serviços em Eletricidade) – Anexo III',
      titulo: 'Curso Complementar – Segurança no Sistema Elétrico de Potência (SEP) e em suas Proximidades',
      modalidades: TRES,
      cargaMin: { inicial: 40 }, avisoCarga: 'NR-10, Anexo III: curso complementar (SEP) com no mínimo 40 h; pré-requisito: curso básico concluído com aproveitamento.',
      validadeMeses: 24,
      base: 'NR-10, item 10.8.8 e Anexo III (2)',
      conteudo: [
        'Organização do Sistema Elétrico de Potência – SEP.',
        'Organização do trabalho: programação e planejamento dos serviços; trabalho em equipe; prontuário e cadastro das instalações; métodos de trabalho; comunicação.',
        'Aspectos comportamentais.',
        'Condições impeditivas para serviços.',
        'Riscos típicos no SEP e sua prevenção: proximidade e contatos com partes energizadas; indução; descargas atmosféricas; estática; campos elétricos e magnéticos; comunicação e identificação; trabalhos em altura, máquinas e equipamentos especiais.',
        'Técnicas de análise de risco no SEP.',
        'Procedimentos de trabalho – análise e discussão.',
        'Técnicas de trabalho sob tensão: em linha viva; ao potencial; em áreas internas; trabalho à distância; trabalhos noturnos; ambientes subterrâneos.',
        'Equipamentos e ferramentas de trabalho (escolha, uso, conservação, verificação, ensaios).',
        'Sistemas de proteção coletiva.',
        'Equipamentos de proteção individual.',
        'Posturas e vestuários de trabalho.',
        'Segurança com veículos e transporte de pessoas, materiais e equipamentos.',
        'Sinalização e isolamento de áreas de trabalho.',
        'Liberação de instalação para serviço e para operação e uso.',
        'Treinamento em técnicas de remoção, atendimento e transporte de acidentados.',
        'Acidentes típicos – análise, discussão e medidas de proteção.',
        'Responsabilidades.'
      ],
      programaLista: 'NR-10 Anexo III – Curso Complementar SEP: organização do SEP; organização do trabalho; aspectos comportamentais; condições impeditivas; riscos típicos e prevenção; análise de risco e procedimentos; técnicas de trabalho sob tensão; equipamentos e ferramentas; EPC e EPI; sinalização e isolamento; liberação de instalação; atendimento e transporte de acidentados; acidentes típicos; responsabilidades.'
    },
    {
      key: 'nr12', curto: 'Máquinas e Equipamentos', nr: 'NR-12', nome: 'NR-12 — Capacitação para operação segura de máquinas e equipamentos',
      norma: 'a Norma Regulamentadora NR-12 (Segurança no Trabalho em Máquinas e Equipamentos) – Anexo II',
      titulo: 'Capacitação para Operação Segura de Máquinas e Equipamentos',
      genero: 'f', modalidades: TRES,
      cargaMin: null, avisoCarga: 'NR-12, item 12.16.3: a carga horária mínima é definida pelo empregador. Injetoras: mínimo de 8 h por tipo de máquina (12.16.11). Motosserra: mínimo de 8 h (Anexo).',
      validadeMeses: null,
      base: 'NR-12, itens 12.16.2 e 12.16.3 e Anexo II (1)',
      conteudo: [
        'Descrição e identificação dos riscos associados com cada máquina e equipamento e as proteções específicas contra cada um deles.',
        'Funcionamento das proteções: como e por que devem ser usadas.',
        'Como e em que circunstâncias uma proteção pode ser removida, e por quem.',
        'O que fazer, por exemplo, contatar o supervisor, se uma proteção foi danificada ou se perdeu sua função, deixando de garantir uma segurança adequada.',
        'Os princípios de segurança na utilização da máquina ou equipamento.',
        'Segurança para riscos mecânicos, elétricos e outros relevantes.',
        'Método de trabalho seguro.',
        'Permissão de trabalho.',
        'Sistema de bloqueio de funcionamento da máquina e equipamento durante operações de inspeção, limpeza, lubrificação e manutenção.'
      ],
      programaLista: 'NR-12 Anexo II: riscos de cada máquina e proteções específicas; funcionamento das proteções; remoção de proteções; conduta quando a proteção é danificada; princípios de segurança na utilização; riscos mecânicos, elétricos e outros; método de trabalho seguro; permissão de trabalho; bloqueio de funcionamento em inspeção, limpeza, lubrificação e manutenção. Etapas teórica e prática.'
    },
    {
      key: 'nr12auto', curto: 'Máquinas Autopropelidas', nr: 'NR-12', nome: 'NR-12 — Capacitação de operador de máquinas autopropelidas',
      norma: 'a Norma Regulamentadora NR-12 (Segurança no Trabalho em Máquinas e Equipamentos) – Anexo II',
      titulo: 'Capacitação de Operador de Máquinas Automotrizes ou Autopropelidas',
      genero: 'f', modalidades: TRES,
      cargaMin: null, avisoCarga: 'NR-12, item 12.16.3: a carga horária mínima é definida pelo empregador. O operador de máquina autopropelida porta cartão de identificação renovado a cada 1 ano com exame médico (12.16.10).',
      validadeMeses: null,
      base: 'NR-12, itens 12.16.2, 12.16.3 e 12.16.10 e Anexo II (1 e 1.1)',
      conteudo: [
        'Descrição e identificação dos riscos associados com cada máquina e equipamento e as proteções específicas contra cada um deles.',
        'Funcionamento das proteções: como e por que devem ser usadas; como e em que circunstâncias uma proteção pode ser removida, e por quem; o que fazer se uma proteção foi danificada ou perdeu sua função.',
        'Os princípios de segurança na utilização da máquina ou equipamento; segurança para riscos mecânicos, elétricos e outros relevantes.',
        'Método de trabalho seguro; permissão de trabalho; sistema de bloqueio de funcionamento durante inspeção, limpeza, lubrificação e manutenção.',
        'Noções sobre legislação de trânsito e de legislação de segurança e saúde no trabalho.',
        'Noções sobre acidentes e doenças decorrentes da exposição aos riscos existentes na máquina, equipamentos e implementos.',
        'Medidas de controle dos riscos: Equipamentos de Proteção Coletiva (EPC) e Equipamentos de Proteção Individual (EPI).',
        'Operação com segurança da máquina ou equipamento.',
        'Inspeção, regulagem e manutenção com segurança.',
        'Sinalização de segurança.',
        'Procedimentos em situação de emergência.',
        'Noções sobre prestação de primeiros socorros.'
      ],
      programaLista: 'NR-12 Anexo II (1 e 1.1) – máquinas autopropelidas: riscos e proteções; princípios de segurança; método de trabalho seguro; legislação de trânsito e de SST; acidentes e doenças; EPC e EPI; operação segura; inspeção, regulagem e manutenção; sinalização; emergência; primeiros socorros. Etapas teórica e prática.'
    },
    {
      key: 'nr33sup', curto: 'Supervisor de Entrada', nr: 'NR-33', nome: 'NR-33 — Supervisor de Entrada em Espaço Confinado (40 h)',
      norma: 'a Norma Regulamentadora NR-33 (Segurança e Saúde nos Trabalhos em Espaços Confinados) – Anexo III',
      titulo: 'Capacitação de Supervisor de Entrada em Espaços Confinados',
      genero: 'f', modalidades: TRES,
      cargaMin: { inicial: 40, periodico: 8 },
      avisoCarga: 'NR-33, Anexo III: supervisor de entrada com 40 h no treinamento inicial e 8 h por ano no periódico; a parte prática tem no mínimo 50% da carga.',
      validadeMeses: 12,
      detalheRotulo: 'Tipo de espaço confinado e atividades', detalheObrigatorio: true,
      detalheAviso: 'NR-33, item 33.6.5: o certificado deve informar o tipo de espaço confinado e as atividades desenvolvidas.',
      base: 'NR-33, itens 33.6.2 a 33.6.5 e Anexo III (1 e 2.1 a)',
      conteudo: [
        'Definições.',
        'Identificação dos espaços confinados.',
        'Reconhecimento, avaliação e controle de riscos.',
        'Funcionamento de equipamentos utilizados.',
        'Procedimentos e utilização da PET (Permissão de Entrada e Trabalho).',
        'Critérios de indicação e uso de equipamentos para controle de riscos.',
        'Conhecimento sobre práticas seguras em espaços confinados.',
        'Legislação de segurança e saúde no trabalho.',
        'Programa de Proteção Respiratória.',
        'Área classificada.',
        'Noções de resgate e primeiros socorros.',
        'Operações de salvamento.'
      ],
      programaLista: 'NR-33 Anexo III – supervisor de entrada: definições; identificação dos espaços confinados; reconhecimento, avaliação e controle de riscos; equipamentos; PET; práticas seguras; legislação de SST; proteção respiratória; área classificada; resgate e primeiros socorros; operações de salvamento.'
    },
    {
      key: 'nr33vig', curto: 'Vigia e Autorizado', nr: 'NR-33', nome: 'NR-33 — Vigia e Trabalhador Autorizado em Espaço Confinado (16 h)',
      norma: 'a Norma Regulamentadora NR-33 (Segurança e Saúde nos Trabalhos em Espaços Confinados) – Anexo III',
      titulo: 'Capacitação de Vigia e Trabalhador Autorizado em Espaços Confinados',
      genero: 'f', modalidades: TRES,
      cargaMin: { inicial: 16, periodico: 8 },
      avisoCarga: 'NR-33, Anexo III: vigia e trabalhador autorizado com 16 h no treinamento inicial e 8 h por ano no periódico; a parte prática tem no mínimo 50% da carga.',
      validadeMeses: 12,
      detalheRotulo: 'Tipo de espaço confinado e atividades', detalheObrigatorio: true,
      detalheAviso: 'NR-33, item 33.6.5: o certificado deve informar o tipo de espaço confinado e as atividades desenvolvidas.',
      base: 'NR-33, itens 33.6.2 a 33.6.5 e Anexo III (1 e 2.1 b)',
      conteudo: [
        'Definições.',
        'Reconhecimento, avaliação e controle de riscos.',
        'Funcionamento de equipamentos utilizados.',
        'Procedimentos e utilização da PET (Permissão de Entrada e Trabalho).',
        'Noções de resgate e primeiros socorros.'
      ],
      programaLista: 'NR-33 Anexo III – vigia e trabalhador autorizado: definições; reconhecimento, avaliação e controle de riscos; funcionamento dos equipamentos utilizados; procedimentos e utilização da PET; noções de resgate e primeiros socorros.'
    },
    {
      key: 'nr35', curto: 'Trabalho em Altura', nr: 'NR-35', nome: 'NR-35 — Trabalho em Altura (8 h)',
      norma: 'a Norma Regulamentadora NR-35 (Trabalho em Altura)',
      titulo: 'Treinamento {mod} de Segurança para Trabalho em Altura',
      modalidades: TRES,
      cargaMin: { inicial: 8, periodico: 8 },
      avisoCarga: 'NR-35, itens 35.4.2.1 e 35.4.2.2: treinamento inicial e periódico (a cada 2 anos) com no mínimo 8 h, teórico e prático.',
      validadeMeses: 24,
      base: 'NR-35, itens 35.4.2.1 e 35.4.2.2',
      conteudo: [
        'Normas e regulamentos aplicáveis ao trabalho em altura.',
        'Análise de Risco (AR) e condições impeditivas.',
        'Riscos potenciais inerentes ao trabalho em altura e medidas de prevenção e controle.',
        'Sistemas, equipamentos e procedimentos de proteção coletiva.',
        'EPI para trabalho em altura: seleção, inspeção, conservação e limitação de uso.',
        'Acidentes típicos em trabalhos em altura.',
        'Condutas em situações de emergência, incluindo noções básicas de técnicas de resgate e de primeiros socorros.'
      ],
      programaLista: 'NR-35 (item 35.4.2.1): normas e regulamentos; análise de risco e condições impeditivas; riscos potenciais e medidas de prevenção e controle; proteção coletiva; EPI para trabalho em altura; acidentes típicos; emergência, noções de resgate e primeiros socorros. Teórico e prático.'
    }
  ];

  function modeloTreino(key) { return MODELOS.find(m => m.key === key) || null; }

  // Título que entra na frase do certificado, ex.: "Treinamento Inicial de ...".
  function tituloTreino(m, modalidade) {
    const base = m.titulo;
    if (base.indexOf('{mod}') >= 0) {
      let r = ROTULO_MODALIDADE[modalidade] || ROTULO_MODALIDADE.inicial;
      if (m.genero === 'f') r = r.replace(/o$/, 'a'); // Periódico -> Periódica
      return base.replace('{mod}', r);
    }
    // sem {mod}: acrescenta a modalidade só quando o modelo aceita mais de uma
    if (m.modalidades.length > 1) {
      const r = (ROTULO_MODALIDADE[modalidade] || 'Inicial');
      const rr = m.genero === 'f' ? r.replace(/o$/, 'a') : r;
      return base.replace(/^(Treinamento|Capacitação|Curso)/, (w) => w + ' ' + rr);
    }
    return base;
  }

  function cargaMinima(m, modalidade) { return m && m.cargaMin ? (m.cargaMin[modalidade] || null) : null; }

  // data (AAAA-MM-DD) + meses -> AAAA-MM-DD, sem estourar o fim do mês
  function validadeSugerida(m, dataISO) {
    if (!m || !m.validadeMeses || !/^\d{4}-\d{2}-\d{2}$/.test(dataISO || '')) return '';
    const [y, mo, d] = dataISO.split('-').map(Number);
    const total = (mo - 1) + m.validadeMeses;
    const ny = y + Math.floor(total / 12), nm = total % 12;
    const ultimo = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
    return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, ultimo)).padStart(2, '0')}`;
  }

  root.MODELOS_TREINAMENTO = MODELOS;
  root.ROTULO_MODALIDADE = ROTULO_MODALIDADE;
  root.modeloTreino = modeloTreino;
  root.tituloTreino = tituloTreino;
  root.cargaMinima = cargaMinima;
  root.validadeSugerida = validadeSugerida;
})(typeof window !== 'undefined' ? window : globalThis);
