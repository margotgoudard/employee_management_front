import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import PermissionService from '../services/Permission';
import '../assets/styles/Permissions.css';

const Permissions = ({ id_user }) => {
  const [open, setOpen] = useState(false);
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const userPermissionsResponse = await PermissionService.getPermissionsByUserId(id_user);
        setAssignedPermissions(userPermissionsResponse);

        const allPermissionsResponse = await PermissionService.getPermissions();
        const allPermissions = allPermissionsResponse;

        const unassignedPermissions = allPermissions.filter(
          (permission) => !userPermissionsResponse.some(
            (assignedPermission) => assignedPermission.id_permission === permission.id_permission
          )
        );
        setAvailablePermissions(unassignedPermissions);
      } catch (error) {
        console.error('Erreur lors du chargement des permissions', error);
      }
    };

    fetchPermissions();
  }, [id_user]); 

  const togglePermission = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAddPermission = async (permission) => {
    try {
      await PermissionService.addPermissionToUser(id_user, permission.id_permission);

      setAssignedPermissions((prevAssigned) => [...prevAssigned, permission]);
      setAvailablePermissions((prevAvailable) =>
        prevAvailable.filter((perm) => perm.id_permission !== permission.id_permission)
      );
    } catch (error) {
      console.error('Erreur lors de l’ajout de la permission', error);
    }
  };

  const handleRemovePermission = async (permission) => {
    try {
      await PermissionService.removePermissionFromUser(id_user, permission.id_permission);

      setAssignedPermissions((prevAssigned) =>
        prevAssigned.filter((perm) => perm.id_permission !== permission.id_permission)
      );
      setAvailablePermissions((prevAvailable) => [
        ...prevAvailable,
        permission,
      ]);
    } catch (error) {
      console.error('Erreur lors de la suppression de la permission', error);
    }
  };

  const filteredPermissions = availablePermissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="permissions-container">
      <div className="assigned-permissions">
        <h2 className="h2Permission">Permissions</h2>
        <div className="permissions-list">
          {assignedPermissions.map((permission, index) => (
            <button
              key={index}
              className="permission-item"
              onClick={() => handleRemovePermission(permission)}
            >
              {permission.name} <FaMinus className="icon-minus" />
            </button>
          ))}
        </div>

        <div className="add-permission" onClick={togglePermission}>
          {open ? (
            <FaMinus className="icon-plus" />
          ) : (
            <FaPlus className="icon-plus" />
          )}
          <span>{open ? 'Fermer' : 'Ajouter une permission'}</span>
        </div>

        {open && (
          <>
            <div className="available-permissions">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Rechercher une permission"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="permissions-list">
                {filteredPermissions.map((permission, index) => (
                  <button
                    key={index}
                    className="permission-item"
                    onClick={() => handleAddPermission(permission)}
                  >
                    {permission.name} <FaPlus className="icon-plus" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Permissions;
