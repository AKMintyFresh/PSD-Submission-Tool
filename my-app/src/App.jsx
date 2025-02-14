import React, { useState } from 'react';
import { AlertCircle, Check, Upload, X, File, Terminal } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";



const ProjectSubmissionForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    ttoMemberName: '',
    priorityTier: '',
    facilityName: '',
    location: '',
    summary: '',
    projectDescription: '',
    projectJustification: '',
    subAwardType: '',
    projectType: '',
    costEstimate: '',
    deficiencies: [{
      fedsId: '',
      description: '',
      totalBudget: '',
      costAddressed: '',
      percentageAddressed: '',
      deficiencyCode: ''
    }]
  });
  
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const totalFiles = [...files, ...newFiles];
    if (totalFiles.length > 5) {
      setErrors(prev => ({
        ...prev,
        files: 'Maximum 5 files allowed'
      }));
      return;
    }

    const invalidFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        files: 'Files must be under 10MB each'
      }));
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setErrors(prev => ({
      ...prev,
      files: ''
    }));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'projectName',
      'ttoMemberName',
      'priorityTier',
      'facilityName',
      'location',
      'summary',
      'projectDescription',
      'projectJustification',
      'subAwardType',
      'projectType',
      'costEstimate'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus('');
        setFormData({
          projectName: '',
          ttoMemberName: '',
          priorityTier: '',
          facilityName: '',
          location: '',
          summary: '',
          projectDescription: '',
          projectJustification: '',
          subAwardType: '',
          projectType: '',
          costEstimate: ''
        });
        setFiles([]);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDeficiencyChange = (index, field, value) => {
    setFormData(prev => {
      const updatedDeficiencies = [...prev.deficiencies];
      updatedDeficiencies[index] = {
        ...updatedDeficiencies[index],
        [field]: value
      };
      
      // Auto-calculate percentage if both totalBudget and costAddressed are numbers
      if (field === 'totalBudget' || field === 'costAddressed') {
        const totalBudget = field === 'totalBudget' ? parseFloat(value) : parseFloat(updatedDeficiencies[index].totalBudget);
        const costAddressed = field === 'costAddressed' ? parseFloat(value) : parseFloat(updatedDeficiencies[index].costAddressed);
        
        if (!isNaN(totalBudget) && !isNaN(costAddressed) && totalBudget !== 0) {
          updatedDeficiencies[index].percentageAddressed = ((costAddressed / totalBudget) * 100).toFixed(1);
        }
      }
      
      return {
        ...prev,
        deficiencies: updatedDeficiencies
      };
    });
  };

  const addDeficiencyRow = () => {
    setFormData(prev => ({
      ...prev,
      deficiencies: [
        ...prev.deficiencies,
        {
          fedsId: '',
          description: '',
          totalBudget: '',
          costAddressed: '',
          percentageAddressed: '',
          deficiencyCode: ''
        }
      ]
    }));
  };

  const removeDeficiencyRow = (index) => {
    setFormData(prev => ({
      ...prev,
      deficiencies: prev.deficiencies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Project Submission Form</h2>
      
      {submitStatus === 'success' && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Project submitted successfully!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="projectName">
              Name of Project *
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="ttoMemberName">
              TTO Member Name *
            </label>
            <input
              type="text"
              id="ttoMemberName"
              name="ttoMemberName"
              value={formData.ttoMemberName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.ttoMemberName && (
              <p className="text-red-500 text-sm mt-1">{errors.ttoMemberName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="priorityTier">
              Priority or Tier Number *
            </label>
            <select
              id="priorityTier"
              name="priorityTier"
              value={formData.priorityTier}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Priority</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
              <option value="4">Tier 4</option>
            </select>
            {errors.priorityTier && (
              <p className="text-red-500 text-sm mt-1">{errors.priorityTier}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="facilityName">
              Facility Name / BLS Number *
            </label>
            <input
              type="text"
              id="facilityName"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.facilityName && (
              <p className="text-red-500 text-sm mt-1">{errors.facilityName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="location">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="summary">
            Summary *
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="2"
            placeholder="This project is necessary to address:"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.summary && (
            <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="projectDescription">
            Project Description *
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Provide a detailed explanation of the work to be accomplished by the project and the desired outcome of the project. Include all items reflected in the cost estimate. This information can be presented in bullet/list or narrative form."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.projectDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="projectJustification">
            Project Justification *
          </label>
          <textarea
            id="projectJustification"
            name="projectJustification"
            value={formData.projectJustification}
            onChange={handleChange}
            rows="4"
            placeholder="Describe why the project must be done. Explain why the project is necessary. Link the justification to the developed Health Facilities Master Plan if appropriate. Discuss how the project will meet program needs, and how it will comply with legal, code, accreditation, and certification requirements. Cite specific, code or TJC references by standard clause, chapter, paragraph, etc."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.projectJustification && (
            <p className="text-red-500 text-sm mt-1">{errors.projectJustification}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="subAwardType">
              Sub-Award Type *
            </label>
            <select
              id="subAwardType"
              name="subAwardType"
              value={formData.subAwardType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Sub-Award Type</option>
              <option value="forceAccount">Force Account</option>
              <option value="reimbursement">Reimbursement</option>
              <option value="ttoManaged">TTO Managed</option>
              <option value="anthcManaged">ANTHC Managed</option>
            </select>
            {errors.subAwardType && (
              <p className="text-red-500 text-sm mt-1">{errors.subAwardType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="projectType">
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Project Type</option>
              <option value="design">Design</option>
              <option value="construction">Construction</option>
              <option value="designBuild">Design/Build</option>
            </select>
            {errors.projectType && (
              <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Deficiencies
          </label>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-full mb-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700 w-28">FEDS ID</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Total FEDS Budget Amount</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">Cost Addressed by Project</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">% Addressed</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">FEDS Deficiency Code</th>
                  <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700 w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.deficiencies.map((deficiency, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.fedsId}
                        onChange={(e) => handleDeficiencyChange(index, 'fedsId', e.target.value)}
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 font-mono"
                        placeholder="3001234"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.description}
                        onChange={(e) => handleDeficiencyChange(index, 'description', e.target.value)}
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.totalBudget}
                        onChange={(e) => handleDeficiencyChange(index, 'totalBudget', e.target.value)}
                        placeholder="$"
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.costAddressed}
                        onChange={(e) => handleDeficiencyChange(index, 'costAddressed', e.target.value)}
                        placeholder="$"
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.percentageAddressed}
                        readOnly
                        className="w-full p-1 border rounded bg-gray-50"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={deficiency.deficiencyCode}
                        onChange={(e) => handleDeficiencyChange(index, 'deficiencyCode', e.target.value)}
                        className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeDeficiencyRow(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={formData.deficiencies.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addDeficiencyRow}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
          >
            + Add Another Deficiency
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="costEstimate">
            Cost Estimate *
          </label>
          <input
            type="text"
            id="costEstimate"
            name="costEstimate"
            value={formData.costEstimate}
            onChange={handleChange}
            placeholder="e.g., $50,000"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.costEstimate && (
            <p className="text-red-500 text-sm mt-1">{errors.costEstimate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Supporting Documents
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${files.length === 0 ? 'hover:border-blue-500 hover:bg-blue-50' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileInput}
              className="hidden"
              id="fileInput"
              multiple
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Maximum 5 files, 10MB each
              </p>
            </label>
          </div>
          {errors.files && (
            <p className="text-red-500 text-sm mt-1">{errors.files}</p>
          )}
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSubmissionForm;
};

export default ProjectSubmissionForm;
