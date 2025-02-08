import {
  Create,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <ReferenceInput source="lessonId" reference="lessons" />
        <SelectInput
          source="type"
          choices={[
            {
              id: 'SELECT',
              name: 'SELECT',
            },
            {
              id: 'ASSIST',
              name: 'ASSIST',
            },
          ]}
          validate={[required()]}
        ></SelectInput>
        <TextInput source="question" validate={[required()]} label="Question" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  )
}
