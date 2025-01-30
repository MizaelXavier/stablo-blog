export default {
  name: 'homePage',
  type: 'document',
  title: 'Home Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required()
    }
  ]
} 