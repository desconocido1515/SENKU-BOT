let WAMessageStubType = (await import(global.baileys)).default

export async function before(m, { conn, participants }) {
    // Solo procesar eventos de grupo
    if (!m.messageStubType || !m.isGroup) return
    
    const grupo = await conn.groupMetadata(m.chat)
    const usuario = m.sender ? `@${m.sender.split('@')[0]}` : 'Alguien'
    
    try {
        // 29 = PROMOTE (nuevo admin)
        if (m.messageStubType == 29) {
            const nuevoAdmin = m.messageStubParameters[0]?.split('@')[0]
            await conn.sendMessage(m.chat, { 
                text: `👑 @${nuevoAdmin} AHORA ES ADMIN 👑`, 
                mentions: [m.messageStubParameters[0]] 
            })
        }
        
        // 30 = DEMOTE (deja de ser admin)
        else if (m.messageStubType == 30) {
            const exAdmin = m.messageStubParameters[0]?.split('@')[0]
            await conn.sendMessage(m.chat, { 
                text: `📉 @${exAdmin} YA NO ES ADMIN 📉`, 
                mentions: [m.messageStubParameters[0]] 
            })
        }
        
        // 21 = CAMBIO DE NOMBRE
        else if (m.messageStubType == 21) {
            await conn.sendMessage(m.chat, { 
                text: `📛 NUEVO NOMBRE: ${m.messageStubParameters[0]}` 
            })
        }
        
        // 22 = CAMBIO DE FOTO
        else if (m.messageStubType == 22) {
            await conn.sendMessage(m.chat, { 
                text: `🖼️ SE CAMBIÓ LA FOTO DEL GRUPO` 
            })
        }
        
        // 24 = CAMBIO DE DESCRIPCIÓN
        else if (m.messageStubType == 24) {
            await conn.sendMessage(m.chat, { 
                text: `📝 NUEVA DESCRIPCIÓN: ${m.messageStubParameters[0]}` 
            })
        }
        
        // 26 = CERRAR/ABRIR GRUPO
        else if (m.messageStubType == 26) {
            const estado = m.messageStubParameters[0] == 'on' ? '🔒 CERRADO' : '🔓 ABIERTO'
            await conn.sendMessage(m.chat, { 
                text: `🚪 GRUPO ${estado}` 
            })
        }
        
        // 32 = NUEVOS MIEMBROS
        else if (m.messageStubType == 32) {
            const nuevos = m.messageStubParameters.map(p => `@${p.split('@')[0]}`).join(', ')
            await conn.sendMessage(m.chat, { 
                text: `👥 BIENVENIDOS: ${nuevos}`, 
                mentions: m.messageStubParameters 
            })
        }
        
        // Mostrar en consola para debug (como en tu imagen)
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType]
        })
        
    } catch (error) {
        console.error('Error en autodetect:', error)
    }
}
