import { v4 as uuidv4 } from 'uuid';

interface MarkdownToBlocksOptions {
  mainImage?: string;
  youtubeUrl?: string;
  mainImageUrl?: string;
}

export function markdownToBlocks(markdown: string, options: MarkdownToBlocksOptions = {}) {
  const blocks: any[] = [];
  
  // Adicionar vídeo do YouTube se fornecido
  if (options.youtubeUrl) {
    blocks.push({
      _type: 'youtube',
      _key: uuidv4(),
      url: options.youtubeUrl
    });
  }

  // Adicionar imagem principal se fornecida como URL
  if (options.mainImageUrl) {
    blocks.push({
      _type: 'block',
      _key: uuidv4(),
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: uuidv4(),
        text: '',
        marks: []
      }]
    });
    blocks.push({
      _type: 'image',
      _key: uuidv4(),
      asset: {
        _type: 'reference',
        _ref: options.mainImageUrl
      }
    });
  }

  // Dividir o markdown em linhas
  const lines = markdown.split('\n').filter(line => line.trim());
  
  let currentBlock: any = null;
  let isFirstTitle = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pular linhas vazias
    if (!line) continue;
    
    // Pular o primeiro título em negrito
    if (isFirstTitle && line.match(/^\*\*.*\*\*$/)) {
      isFirstTitle = false;
      continue;
    }
    
    // Processar cabeçalhos
    if (line.startsWith('### ')) {
      const text = line.replace('### ', '').replace(/\*\*/g, '');
      blocks.push({
        _type: 'block',
        _key: uuidv4(),
        style: 'h3',
        markDefs: [],
        children: [{
          _type: 'span',
          _key: uuidv4(),
          text,
          marks: []
        }]
      });
      continue;
    }
    
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').replace(/\*\*/g, '');
      blocks.push({
        _type: 'block',
        _key: uuidv4(),
        style: 'h2',
        markDefs: [],
        children: [{
          _type: 'span',
          _key: uuidv4(),
          text,
          marks: []
        }]
      });
      continue;
    }
    
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').replace(/\*\*/g, '');
      blocks.push({
        _type: 'block',
        _key: uuidv4(),
        style: 'h1',
        markDefs: [],
        children: [{
          _type: 'span',
          _key: uuidv4(),
          text,
          marks: []
        }]
      });
      continue;
    }
    
    // Processar texto normal com marcações
    const spans: {
      _type: string;
      _key: string;
      text: string;
      marks: string[];
    }[] = [];
    let currentText = line;
    
    // Processar texto em negrito
    const boldMatches = currentText.match(/\*\*(.*?)\*\*/g);
    if (boldMatches) {
      let lastIndex = 0;
      for (const match of boldMatches) {
        const index = currentText.indexOf(match, lastIndex);
        
        // Adicionar texto antes do negrito
        if (index > lastIndex) {
          spans.push({
            _type: 'span',
            _key: uuidv4(),
            text: currentText.slice(lastIndex, index),
            marks: []
          });
        }
        
        // Adicionar texto em negrito
        spans.push({
          _type: 'span',
          _key: uuidv4(),
          text: match.replace(/\*\*/g, ''),
          marks: ['strong']
        });
        
        lastIndex = index + match.length;
      }
      
      // Adicionar texto restante
      if (lastIndex < currentText.length) {
        spans.push({
          _type: 'span',
          _key: uuidv4(),
          text: currentText.slice(lastIndex),
          marks: []
        });
      }
    } else {
      spans.push({
        _type: 'span',
        _key: uuidv4(),
        text: currentText,
        marks: []
      });
    }
    
    blocks.push({
      _type: 'block',
      _key: uuidv4(),
      style: 'normal',
      markDefs: [],
      children: spans
    });
  }
  
  return blocks;
} 