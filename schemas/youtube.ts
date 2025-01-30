import { defineType, defineField } from 'sanity'
import { PlayIcon } from '@sanity/icons'
import { YouTubePreview } from './YouTubePreview'

export default defineType({
  name: 'youtube',
  type: 'object',
  title: 'YouTube Embed',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL do YouTube',
      description: 'Cole a URL do vídeo do YouTube aqui'
    }),
    {
      name: 'title',
      type: 'string',
      title: 'Título',
      readOnly: true
    },
    {
      name: 'description',
      type: 'text',
      title: 'Descrição',
      readOnly: true
    },
    {
      name: 'thumbnail',
      type: 'object',
      title: 'Thumbnail',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL'
        }
      ],
      readOnly: true
    }
  ],
  preview: {
    select: {
      title: 'url'
    }
  },
  components: {
    preview: YouTubePreview
  }
}) 