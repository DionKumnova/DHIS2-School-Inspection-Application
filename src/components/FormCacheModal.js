import React from 'react';
import { Modal, ModalTitle, ModalContent, Button } from '@dhis2/ui';

const FormCacheModal = ({ onClose }) => {
    return (
        <Modal position="middle" large onClose={onClose}>
            <ModalTitle>Saved!</ModalTitle>
            <ModalContent>
                <p>Your form was successfully saved and will be submitted once you are online.</p>
                <div style={{ marginTop: '1em', textAlign: 'right' }}>
                    <Button primary onClick={onClose}>
                        OK
                    </Button>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default FormCacheModal;