import { useDispatch, useSelector } from "react-redux";
import {
  showBottomBar,
  selectCurrentBottomBarTab,
} from "@actions/uiStateActions";
import useGuides from "@hooks/useGuides"

const useDeepLinking = () => {
  const dispatch = useDispatch();
  const { navigation } = useSelector(s => s);
  const { navigationCategories } = navigation;
  const { linkToGuide } = useGuides();

  const linkingHome = async (params) => {
    const { id_1 } = params;
    if (id_1) {
      let item;
      navigationCategories.map(category => {
        let temp;
        temp = category.items.find(group => group.id.toString() === id_1.toString());
        if (temp) {
          item = temp;
        }
      });

      dispatch(selectCurrentBottomBarTab(0));
      dispatch(showBottomBar(false));
      linkToGuide(item, params);
    }
  };
  return { linkingHome };
};

export default useDeepLinking;
