import React from 'react';

const AnalysisResults = ({ analysisData }) => {
  if (!analysisData) return null;

  const { totalScore, statistics, recommendations, categorized, summary } = analysisData;

  const getChanceColor = (level) => {
    const colors = {
      'high': 'bg-green-100 text-green-800',
      'medium-high': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-orange-100 text-orange-800',
      'very-low': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const ScoreCard = ({ title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );

  const ProgramCard = ({ program }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{program.programName}</h3>
          <p className="text-sm text-gray-600">{program.university.name}</p>
          <p className="text-xs text-gray-500">{program.university.city}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getChanceColor(program.chance.level)}`}>
          {program.chance.label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-gray-500">Faculty</p>
          <p className="font-medium">{program.faculty}</p>
        </div>
        <div>
          <p className="text-gray-500">Min Score</p>
          <p className="font-medium">{program.minScore} / 140</p>
        </div>
        <div>
          <p className="text-gray-500">Your Score</p>
          <p className={`font-medium ${program.qualified ? 'text-green-600' : 'text-red-600'}`}>
            {totalScore} {program.qualified ? '✓' : '✗'}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Difference</p>
          <p className={`font-medium ${program.scoreDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {program.scoreDifference > 0 ? '+' : ''}{program.scoreDifference}
          </p>
        </div>
      </div>

      {program.grantAvailable && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800">
            🎓 Grant Available
          </p>
        </div>
      )}
    </div>
  );

  const CategorySection = ({ title, programs, description, icon }) => {
    if (programs.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">{icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
            {programs.length} programs
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program, index) => (
            <ProgramCard key={index} program={program} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your UNT Analysis Results</h1>
        <p className="text-gray-600">
          Based on your total score of <span className="font-semibold text-blue-600">{totalScore}/140</span>
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <ScoreCard 
          title="Your Score" 
          value={`${totalScore}/140`}
          subtitle={`${statistics.percentage}%`}
          color="blue"
        />
        <ScoreCard 
          title="Programs Found" 
          value={summary.totalPrograms}
          subtitle={`${summary.qualifiedPrograms} you qualify for`}
          color="green"
        />
        <ScoreCard 
          title="Average Min Score" 
          value={statistics.averageMinScore}
          subtitle="across all programs"
          color="purple"
        />
        <ScoreCard 
          title="Grant Programs" 
          value={statistics.programsWithGrant}
          subtitle="with scholarships"
          color="yellow"
        />
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Score Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Programs Below Your Score</p>
            <p className="text-3xl font-bold text-green-600">{statistics.programsBelowScore}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Programs Above Your Score</p>
            <p className="text-3xl font-bold text-yellow-600">{statistics.programsAboveScore}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Score Range</p>
            <p className="text-xl font-bold text-blue-600">
              {statistics.lowestMinScore} - {statistics.highestMinScore}
            </p>
          </div>
        </div>
      </div>

      {/* Categorized Recommendations */}
      <div>
        <CategorySection
          title="Safety Schools"
          description="High chance of admission - these are your safe options"
          icon="✅"
          programs={categorized.safe}
        />
        
        <CategorySection
          title="Target Schools"
          description="Good match for your score - realistic options to consider"
          icon="🎯"
          programs={categorized.target}
        />
        
        <CategorySection
          title="Reach Schools"
          description="Challenging but possible - worth applying if you're interested"
          icon="🚀"
          programs={categorized.reach}
        />
      </div>

      {/* No Results Message */}
      {recommendations.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">
            No programs found matching your criteria. Try adjusting your preferred faculty or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;