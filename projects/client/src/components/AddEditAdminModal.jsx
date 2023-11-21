import api from "../api";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

export const AddEditAdminModal = ({ isOpen, onClose, data, modalFor }) => {
  const formik = useFormik({
    initialValues: {
      username: data?.username,
      email: data?.email,
      role: data?.isWarehouseAdmin,
      password: modalFor === "Create" ? "" : undefined,
      confirmPassword: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Please enter your username"),
      email: yup.string().required("Please enter your email"),
      role: yup.boolean().required("Please select role"),
      password: modalFor === "Create" ? yup.string().required("Please enter your password") : yup.string(),
      confirmPassword:
        modalFor === "Create"
          ? yup
              .string()
              .oneOf([yup.ref("password"), null], "Passwords must match")
              .required("Please confirm your password")
          : yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (modalFor === "Edit") {
          const response = await api.patch(`/users/admin/${data.id}`, {
            username: values.username,
            email: values.email,
            isWarehouseAdmin: values.role,
            password: values.password ? values.password : data?.password,
          });
          if (response.data.ok) {
            toast.success("Update admin success");
            formik.resetForm();
            onClose();
          }
        } else if (modalFor === "Create") {
          const response = await api.post("/users", {
            username: values.username,
            email: values.email,
            isWarehouseAdmin: values.role,
            password: values.password,
          });
          if (response.data.ok) {
            toast.success("Add admin success");
            formik.resetForm();
            onClose();
          }
        }
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 500 || error.response.status === 400)) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
          if (error.response.status === 500) console.error("Internal Server Error: Something went wrong");
        }
      }
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <Text>{modalFor} Admin</Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" placeholder="Username" {...formik.getFieldProps("username")} className="rounded-md" />
                {formik.touched.username && formik.errors.username && <p className="text-red-500">{formik.errors.username}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="Email" {...formik.getFieldProps("email")} className="rounded-md" />
                {formik.touched.email && formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password {modalFor === "Edit" && " (Optional)"}</label>
                <input type="password" name="password" placeholder="password" {...formik.getFieldProps("password")} className="rounded-md" />
                {formik.touched.password && formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
              </div>

              {modalFor === "Create" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" {...formik.getFieldProps("confirmPassword")} className="rounded-md" />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500">{formik.errors.confirmPassword}</p>}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="role">Role</label>
                <select name="role" {...formik.getFieldProps("role")} className="border border-black rounded-md p-2">
                  <option value={""} disabled>
                    Select Role
                  </option>
                  <option value={1}>Warehouse Admin</option>
                  <option value={0}>Super Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && <p className="text-red-500">{formik.errors.role}</p>}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="bg-slate-900 hover:bg-slate-700 text-white w-20 p-2 rounded-md mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-red-700 hover:bg-red-800 p-2 text-white w-20 rounded-md" type="submit">
              Save
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
