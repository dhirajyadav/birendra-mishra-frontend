import React from 'react';
import { PurposeMissionValuesSectionData } from '@/lib/types';

interface PMVProps {
  data?: PurposeMissionValuesSectionData;
}

export default function PurposeMissionValuesSection({ data }: PMVProps) {
  const eyebrow = data?.eyebrow || 'Strategic Foundations';
  const title = data?.title || 'Purpose, Mission & Values';
  const lead =
    data?.lead ||
    'A clear set of principles for how financial leadership, judgement and professional responsibility should be exercised.';

  const purposeNum = data?.purposeNumber || '01 / PURPOSE';
  const purposeTitle = data?.purposeTitle || 'Positive, enduring change';
  const purposeDesc =
    data?.purposeDescription || 'To help create positive, enduring change in the world.';

  const missionNum = data?.missionNumber || '02 / MISSION';
  const missionTitle = data?.missionTitle || 'Distinctive, lasting improvement';
  const missionDesc =
    data?.missionDescription ||
    'To support organisations in making distinctive, lasting and significant improvements in their overall performance.';

  const valuesNum = data?.valuesNumber || '03 / VALUES';
  const valuesTitle = data?.valuesTitle || 'Professional standards & independence';
  const valuesDesc =
    data?.valuesDescription ||
    "Adhere to the highest professional and ethical standards; put organisations' interests ahead; preserve confidence and trust; maintain an independent perspective; and manage resources in an optimised, cost-effective manner.";

  return (
    <div className="meet-subblock" id="purpose-mission-values" aria-label="Purpose, Mission &amp; Values">
      <div className="meet-subblock-head pmv-reveal-head">
        <div className="exp-eyebrow">
          <span className="exp-eyebrow-line" aria-hidden="true"></span>
          <span className="exp-eyebrow-text">{eyebrow}</span>
        </div>
        <h2 className="exp-title">{title}</h2>
        <p className="pmv-lead">{lead}</p>
      </div>

      <div className="pmv-grid">
        {/* 01 / Purpose Card */}
        <article className="pmv-card">
          <div className="pmv-card-eyebrow">{purposeNum}</div>
          <h3 className="pmv-card-title">{purposeTitle}</h3>
          <p className="pmv-card-desc">{purposeDesc}</p>
        </article>

        {/* 02 / Mission Card */}
        <article className="pmv-card">
          <div className="pmv-card-eyebrow">{missionNum}</div>
          <h3 className="pmv-card-title">{missionTitle}</h3>
          <p className="pmv-card-desc">{missionDesc}</p>
        </article>

        {/* 03 / Values Card */}
        <article className="pmv-card">
          <div className="pmv-card-eyebrow">{valuesNum}</div>
          <h3 className="pmv-card-title">{valuesTitle}</h3>
          <p className="pmv-card-desc">{valuesDesc}</p>
        </article>
      </div>
    </div>
  );
}
