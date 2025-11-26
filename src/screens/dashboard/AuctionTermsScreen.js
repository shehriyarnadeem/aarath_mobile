import React, { useState } from "react";
import AuctionTermsModal from "../../components/AuctionTermsModal";

const AuctionTermsScreen = ({ navigation, route }) => {
  const { auction } = route.params;

  const handleAccept = () => {
    // Navigate to auction room
    navigation.navigate("AuctionRoom", { auction });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <AuctionTermsModal
      visible={true}
      onClose={handleClose}
      onAccept={handleAccept}
      auction={auction}
      navigation={navigation}
    />
  );
};

export default AuctionTermsScreen;
