// This is a general component structure

// =============== All imports ===============

/**
 * Try to use Formik form with yup validations
    * 1. Formik form
    * 2. Yup validations
    In case of issue, you can use, custom form
 */

// Main Code
const Form = ({ params }: { params: string }) => {
  console.log(`params`, params);
  return (
    <>
      <button className="btn btn-primary">{params}</button>
    </>
  );
};

export default Form;
