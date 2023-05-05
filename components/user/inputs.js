// component for inputs
export const RegularInput = ({ ref, name, title, value, change, placeholder, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <input type="text" id={name}
                    className={`px-3 py-2 border outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                    name={name}
                    value={value}
                    onChange={e => change(e.target.value)} 
                    placeholder={placeholder}
                    ref={ref}
            />
        </div>
    )
}

// component for inputs
export const RegularInput2 = ({ ref, name, title, value, change, placeholder, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <input type="text" id={name}
                    className={`px-3 py-2 border outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                    name={name}
                    value={value}
                    onChange={change} 
                    placeholder={placeholder}
                    ref={ref}
            />
        </div>
    )
}

export const RegularInput3 = ({ ref, name, title, value, change, placeholder, m, inputP, textSize, disabled }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            {disabled ? 
            
                <input type="text" id={name}
                        className={`${inputP} border outline-none ${textSize} border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                        name={name}
                        value={value}
                        onChange={change} 
                        placeholder={placeholder}
                        ref={ref}
                        disabled
                />
            :
                <input type="text" id={name}
                        className={`${inputP} border outline-none ${textSize} border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                        name={name}
                        value={value}
                        onChange={change} 
                        placeholder={placeholder}
                        ref={ref}
                />
            }
        </div>
    )
}

// component for textarea
export const RegularTextArea = ({ name, title, value, change, placeholder, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <textarea type="text" id={name}
                    className={`px-3 py-2 border resize-none outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-purple'}`}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={e => change(e.target.value)}
            ></textarea>
        </div>
    )
}

// components for dropdown (select)
export const RegularDropDown = ({ name, title, value, change, options, m }) => {
    return (
        <div className={`flex flex-col my-2 ${m}`}>
            <label htmlFor={name} className='text-sm font-medium mb-2'>{title}</label>
            <select id={name} value={value}
                    className={`px-3 py-2 border resize-none outline-none text-sm border-task-ss-white-300 rounded-md transition-all ${ 'focus:border-task-ss-red'}`}
                    name={name}
                    onChange={e => change(e.target.value)}
            >
                {options.map((option, index) => (
                    <option key={index.toString()} value={option.value}>{option.label}</option>
                ))}

            </select>
        </div>
    )
}