import { Datagrid, List, ReferenceField, TextField } from 'react-admin'

export const LessonList = () => {
  return (
    <List resource="lessons">
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <ReferenceField source="unitId" reference="units" />
        <TextField source="order" />
      </Datagrid>
    </List>
  )
}
