import React from 'react';
import { Menu, MenuItem, IconUser24, IconFileDocument24, IconEdit24} from '@dhis2/ui';
import styles from '../styles/Navigation.module.css';

export default function Navigation(props) {
  return (
    <div className={styles.navigationContainer}>
      <Menu>
        <MenuItem
          label="School and Role"
          active={props.activePage === 'RoleSelect'}
          onClick={() => props.activePageHandler('RoleSelect')}
          icon={<IconUser24 />}
          labelClassName={styles.boldLabel}
        />
        {props.role === "Head Teacher" && Object.keys(props.school).length !== 0 && (
          <MenuItem
            label="Resource Count Form"
            active={props.activePage === 'ResourceCount'}
            onClick={() => props.activePageHandler('ResourceCount')}
            icon={<IconEdit24 />}
            labelClassName={styles.boldLabel}
          />
        )}
        {props.role === "School Inspector" && props.district.id !== null && (
          <MenuItem
            label="School Inspection Form"
            active={props.activePage === 'Inspection'}
            onClick={() => props.activePageHandler('Inspection')}
            icon={<IconEdit24 />}
            labelClassName={styles.boldLabel}
          />
        )}
        {(props.role === "School Inspector" && props.district.id !== null) ||
        (props.role === "Head Teacher" && Object.keys(props.school).length !== 0) ? (
          <MenuItem
            label="Reports"
            active={props.activePage === 'ViewReports'}
            onClick={() => props.activePageHandler('ViewReports')}
            icon={<IconFileDocument24 />}
            labelClassName={styles.boldLabel}
          />
        ) : null}
      </Menu>
    </div>
  );
}
