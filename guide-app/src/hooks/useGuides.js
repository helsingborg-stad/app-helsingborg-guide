import { useDispatch, useSelector } from "react-redux";
import { fetchGuides } from "@actions/guideActions";
import { fetchGuideGroups } from "@actions/guideGroupActions";


const useGuides = () => {
  const dispatch = useDispatch();
  const { navigation, guideGroups, guides } = useSelector(s => s );
  const { navigationCategories, currentLanguage } = navigation;


  const getGuides = () => {
    if (navigationCategories.length) {
      navigationCategories.forEach(cat => {
        const _guides: number[] = [];
        const _guideGroups: number[] = [];
        const _interactiveGuides: number[] = [];
        cat.items.forEach(navItem => {
          const { type, id } = navItem;
          if (type === "guide") {
            _guides.push(id);
          } else if (type === "guidegroup") {
            _guideGroups.push(id);
          } else if (type === "interactive_guide") {
            _interactiveGuides.push(id);
          }
        });


        if(!guides.items.length && _guides.length) {
          dispatch(fetchGuides((currentLanguage || "sv"), _guides))
        }
        if(!guideGroups.items.length && _guideGroups.length) {
          dispatch(fetchGuideGroups((currentLanguage || "sv"), _guideGroups))
        }
      })
    }
  }

  return { getGuides }

}

export default useGuides;
