import { useMemo, useRef, useState } from "react";
import Modal from "../components/Modal/Modal";
import DeleteButtonComponent from "../components/Buttons/DeleteButton";
import JoditEditor from "jodit-react";
import Cookies from "js-cookie";


export default function DashboardPage() {
  const [basicModal, setBasicModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  // const [userData, setUserData] = useState({ name: "", email: "" });

  console.log(Cookies.get("task"));
  
  
  console.log(Cookies.get("userInfo"))

const Example = ({ placeholder }: { placeholder?: string }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
       toolbarAdaptive: false, // keep toolbar consistent
       buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "eraser",
        "ul",
        "ol",
        "outdent",
        "indent",
        "align",
        "undo",
        "redo",
        "hr",
        "link",
        "table",
        "fontsize",
        "paragraph",
        "print",
        "selectall",
        "copyformat",
      ],
    }),
    [placeholder]
  );

  return (
    <div className="w-1/2  mt-8"> {/* width 50% and centered */}
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => setContent(newContent)}
      onChange={() => {}}
      className="border rounded-md" // Add border and rounded corners
      
      />
      </div>
  );
};

  const handleDelete = () => {
    // Your delete logic here
    console.log("Item deleted!");
    setConfirmModal(false);
  };


  return (
<>
    
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-foreground)" }}>
            Dashboard
          </h1>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Modal examples and usage
          </p>
        </div>

        {/* Modal Triggers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Modal Card */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              background: "var(--background-secondary)",
              borderColor: "var(--border-light)"
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Basic Modal
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Simple modal with title and content
            </p>
            <button 
              onClick={() => setBasicModal(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: "var(--interactive-primary)",
                color: "var(--text-inverse)",
              }}
            >
              Open Basic Modal
            </button>
          </div>

          {/* Confirmation Modal Card */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              background: "var(--background-secondary)",
              borderColor: "var(--border-light)"
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Confirmation Modal
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Modal for dangerous actions
            </p>
            
            <DeleteButtonComponent onClick={() => setConfirmModal(true)} >Delete Item</DeleteButtonComponent>
          </div>

          {/* Form Modal Card */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              background: "var(--background-secondary)",
              borderColor: "var(--border-light)"
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Form Modal
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Modal with form inputs
            </p>
            <button 
              onClick={() => setFormModal(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{
                background: "var(--success-500)",
                color: "white",
              }}
            >
              Add User
            </button>
          </div>
       
          
        </div>

        {/* Basic Modal */}
        <Modal
          isOpen={basicModal}
          onClose={() => setBasicModal(false)}
          title="Basic Modal Example"
          size="md"
        >
          <div className="space-y-4">
            <p style={{ color: "var(--text-secondary)" }}>
              This is a basic modal with default settings. It demonstrates:
            </p>
            <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
              <li>• Click outside to close</li>
              <li>• Press Escape to close</li>
              <li>• Click X button to close</li>
              <li>• Prevents body scroll</li>
            </ul>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setBasicModal(false)}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                style={{
                  background: "var(--interactive-primary)",
                  color: "var(--text-inverse)",
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          isOpen={confirmModal}
          onClose={() => setConfirmModal(false)}
          title="Confirm Delete"
          size="sm"
          closeOnOverlayClick={false}
        >
          <div className="space-y-4">
            <p style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                style={{
                  background: "var(--interactive-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-light)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                style={{
                  background: "var(--error-500)",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Form Modal */}
        {/* <Modal
          isOpen={formModal}
          onClose={() => setFormModal(false)}
          title="Add New User"
          size="full"
        >
       <KYCListPage setSearchKYC={setSearchKYC} />
        </Modal> */}


      </div>

      {/* <RichTextEditor
        name="post"
        placeholder="Write post"
        onChange={onChange}
        initialValue={undefined}
      /> */}


       <Example placeholder="Enter your content here" />

      


      
  
</>

  );
}
