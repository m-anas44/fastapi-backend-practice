// This is a general component structure

// =============== All imports ===============

// Main Code
const Button = ({ params }: { params: string }) => {
  console.log(`params`, params);
  return (
    <>
      <button className="btn btn-primary">{params}</button>
    </>
  );
};

export default Button;
