import { Datagrid, List, TextField } from 'react-admin'

export const CourseList = () => {
  return (
    <List resource="courses">
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="imageSrc" />
      </Datagrid>
    </List>
  )
}
