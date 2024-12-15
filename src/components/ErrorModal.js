import React from "react";
import { Modal, ModalTitle, ModalContent, Button } from "@dhis2/ui";

const ErrorModal = ({ onClose, message }) => {
    return (
        <Modal position="middle" large onClose={onClose}>
            <ModalTitle>Your form was not submitted</ModalTitle>
            <ModalContent>
                <p>{message}</p>
                <div style={{ marginTop: "1em", textAlign: "right" }}>
                    <Button primary onClick={onClose}>
                        OK
                    </Button>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default ErrorModal;
