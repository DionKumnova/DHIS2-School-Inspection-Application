import React from "react";
import { Modal, ModalTitle, ModalContent, Button } from "@dhis2/ui";

const FormSuccessModal = ({ onClose }) => {
    return (
        <Modal
            className="custom-modal success"
            position="middle"
            large
            onClose={onClose}
        >
            <ModalTitle>Success!</ModalTitle>
            <ModalContent>
                <p>Your form was successfully submitted.</p>
                <div style={{ marginTop: "1em", textAlign: "right" }}>
                    <Button primary onClick={onClose}>
                        OK
                    </Button>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default FormSuccessModal;
