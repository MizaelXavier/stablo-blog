import { type StructureBuilder } from 'sanity/desk'
import { type DocumentDefinition } from 'sanity'

export const pageStructure = (schemas: DocumentDefinition[]) => {
  return (S: StructureBuilder) =>
    S.list()
      .title('Conteúdo')
      .items([
        // Singleton items
        ...schemas.map((schema) =>
          S.listItem()
            .title(schema.title || schema.name)
            .icon(schema.icon)
            .child(
              S.document()
                .schemaType(schema.name)
                .documentId(schema.name)
            )
        ),
        // Regular document types
        S.divider(),
        ...S.documentTypeListItems().filter(
          (listItem) => !schemas.find((schema) => schema.name === listItem.getId())
        )
      ])
}

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Duplicate' action on singleton types
      actions: (input: any, context: any) => {
        if (types.includes(context.schemaType)) {
          return input.filter(({ action }: any) => action !== 'duplicate')
        }
        return input
      },
      // Prevent creation of new documents of singleton types
      newDocumentOptions: (prev: any, context: any) => {
        if (types.includes(context.creationContext.type)) {
          return prev.filter(({ templateId }: any) => !templateId)
        }
        return prev
      },
      // Filter out singleton types from document lists
      lists: (prev: any, context: any) => {
        if (context.parent) {
          return prev
        }
        return prev.filter((item: any) => !types.includes(item.getId()))
      }
    }
  }
} 