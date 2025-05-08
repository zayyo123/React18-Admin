import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirstMenu } from '@/menus/utils/helper';
import { useCommonStore } from '@/hooks/useCommonStore';

function Page() {
  const { permissions, menuList } = useCommonStore();
  const navigate = useNavigate();

  /** 跳转第一个有效菜单路径 */
  const goFirstMenu = useCallback(() => {
    const firstMenu = getFirstMenu(menuList, permissions);
    navigate(firstMenu);
  }, [menuList, navigate, permissions]);

  useEffect(() => {
    // 跳转第一个有效菜单路径
    goFirstMenu();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, permissions]);

  return (
    <div></div>
  );
}

export default Page;
