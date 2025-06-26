import com.licoreriabillar.dto.CategoriaDTO;
import com.licoreriabillar.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> getAll() {
        return categoriaService.getAll().stream().map(cat -> {
            CategoriaDTO dto = new CategoriaDTO();
            dto.setId(cat.getId());
            dto.setNombre(cat.getNombre());
            dto.setDescripcion(cat.getDescripcion());
            dto.setActivo(cat.getActivo());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> getById(@PathVariable Long id) {
        Optional<Categoria> categoriaOpt = categoriaService.getById(id);
        if (categoriaOpt.isPresent()) {
            Categoria cat = categoriaOpt.get();
            CategoriaDTO dto = new CategoriaDTO();
            dto.setId(cat.getId());
            dto.setNombre(cat.getNombre());
            dto.setDescripcion(cat.getDescripcion());
            dto.setActivo(cat.getActivo());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 