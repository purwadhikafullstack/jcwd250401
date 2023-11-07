import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";

export const UpdateProfileModal = ({ isOpen, onClose }) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      email: yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your login logic here
    },
  });
  return (
    <>
      <Modal show={isOpen} size="md" onClose={onClose} popup>
        <Modal.Header>Update Profile</Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Username</h4>
                </div>
                <input type="text" id="username" name="username" placeholder="Enter your username" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("username")} />
                {formik.touched.username && formik.errors.username ? <div className="text-red-500">{formik.errors.username}</div> : null}
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">First Name</h4>
                </div>
                <input type="text" id="firstname" name="firstname" placeholder="Enter your first name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("firstname")} />
                {formik.touched.firstname && formik.errors.firstname ? <div className="text-red-500">{formik.errors.firstname}</div> : null}
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Last Name</h4>
                </div>
                <input type="text" id="lastname" name="lastname" placeholder="Enter your last name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("lastname")} />
                {formik.touched.lastname && formik.errors.lastname ? <div className="text-red-500">{formik.errors.lastname}</div> : null}
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                </div>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
              </div>
              <div className="flex justify-between">
                <button className="w-[40%] h-[5vh] rounded-md text-white bg-black hover:bg-gray-600" type="submit">
                  Update
                </button>
                <button className="w-[40%] h-[5vh] rounded-md text-white bg-black hover:bg-gray-600" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
