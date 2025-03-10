import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'
import ReactPlayer from 'react-player/youtube'

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof url === 'string' 
        ? <ReactPlayer url={url} /> 
        : <Text>Adicione uma URL do YouTube</Text>}
    </Flex>
  )
} 