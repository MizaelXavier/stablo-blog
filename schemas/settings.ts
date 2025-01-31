export default {
  name: 'settings',
  title: 'Settings',
  type: 'document' as const,
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Used for social media preview',
      options: {
        hotspot: true
      }
    }
  ]
} 