import { useUser } from './useUser';

const usePermission = () => {
  const { user } = useUser();
  const { role } = user;
  return {
    isEditor: role === 'editor',
    isEditorInChief: role === 'editor-in-chief',
    isAuthor: role === 'author',
    isAppManager: role === 'app-Manager',
    isSystemsAdmin: role === 'systems-admin',
    isManagingEditor: role === 'managing-editor',
  };
};

export default usePermission;
