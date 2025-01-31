const { createClient } = require('@sanity/client')
require('dotenv').config()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-27',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function deletePosts() {
  try {
    // Buscar todos os IDs dos posts
    const posts = await client.fetch('*[_type == "post"]._id')
    console.log(`Encontrados ${posts.length} posts para deletar`)
    
    // Deletar cada post
    for (const postId of posts) {
      await client.delete(postId)
      console.log(`Post deletado: ${postId}`)
    }
    
    console.log('Todos os posts foram deletados com sucesso!')
  } catch (error) {
    console.error('Erro ao deletar posts:', error)
  }
}

deletePosts() 