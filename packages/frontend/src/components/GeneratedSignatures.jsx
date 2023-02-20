import React from "react";
import "./styles/generatedsignatures.css";

const GeneratedSignatures = (props) => {
  return (
    <div className="card-long">
      <div className="labels">
        <span>Generated Signatures</span>
      </div>
      {props.signatures.map((signature, i) => (
        <div className="signature-card" key={i}>
          <div className="container">
            <div className="float-left">
              <div className="title-items">
                <div className="title-group">
                  <div className="title-span">Timestamp:</div>
                  <div className="items">{signature.timestamp}</div>
                </div>
                <div className="title-group">
                  <div className="title-span">Address:</div>
                  <span className="items">{signature.address}</span>
                </div>
                <div className="title-group">
                  <div className="title-span">Message:</div>
                  <div className="items">{signature.message}</div>
                </div>
              </div>
            </div>
            <div className="signature-div">
              <div className="signature-title">
                <span>Signature</span>
              </div>
              <textarea
                readOnly={true}
                className="signaturehash"
                value={signature.signatureHash}
              ></textarea>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GeneratedSignatures;
