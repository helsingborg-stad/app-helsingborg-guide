import React from "react";
import _Accordion from "react-native-collapsible/Accordion";

const Accordion = (props) => {

const {
  children,
  sections,
  activeSections,
  onChange,
  renderSectionTitle,
  renderHeader,
  renderContent,
  renderFooter,
  underlayColor,
} = props;


return (
  <_Accordion
    sections={sections}
    activeSections={activeSections}
    onChange={(active) => onChange(active)}
    renderSectionTitle={renderSectionTitle}
    renderHeader={renderHeader}
    renderContent={renderContent}
    renderFooter={renderFooter}
    underlayColor={underlayColor || "black"}
  >
    {children}
  </_Accordion>
)
}

export default Accordion;
